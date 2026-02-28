<?php
// ตั้งค่า Header เพื่อให้รองรับการเรียกใช้งาน API จากหน้า HTML (CORS & JSON)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json; charset=utf-8');

// หากเป็นการเรียกแบบ OPTIONS (Preflight) ให้หยุดการทำงานแค่นี้
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

// ==========================================
// 1. การเชื่อมต่อฐานข้อมูล (Database Connection)
// ==========================================
$host = 'localhost';
$dbname = 'music_admin_db';
$username = 'root'; // เปลี่ยนตามที่ใช้จริง
$password = '';     // เปลี่ยนตามที่ใช้จริง

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    // ตั้งค่าให้แสดง Error เป็น Exception
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "เชื่อมต่อฐานข้อมูลล้มเหลว: " . $e->getMessage()]);
    exit;
}

// ==========================================
// 2. ฟังก์ชัน INSERT: เพิ่มสินค้าใหม่ (Add Product)
// ==========================================
function addProduct($pdo, $data, $files) {
    try {
        // สร้างรหัสสินค้าแบบสุ่ม 
        $productCode = uniqid('HKL'); 
        
        // --- ส่วนจัดการอัปโหลดรูปภาพ ---
        $imagePaths = [];
        $imageBannerPath = null;
        $uploadDir = 'uploads/';
        
        // สร้างโฟลเดอร์ uploads ถ้ายังไม่มี
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        // 1. จัดการรูปภาพสินค้า (Product Images)
        if (isset($files['product_images']) && !empty($files['product_images']['name'][0])) {
            $fileCount = count($files['product_images']['name']);
            
            // วนลูปบันทึกไฟล์ (สูงสุด 5 รูป)
            for ($i = 0; $i < $fileCount; $i++) {
                if ($i >= 5) break; 
                
                $tmpName = $files['product_images']['tmp_name'][$i];
                $fileName = basename($files['product_images']['name'][$i]);
                
                if ($tmpName != "") {
                    // ตั้งชื่อไฟล์ใหม่เพื่อป้องกันชื่อซ้ำ
                    $newFileName = uniqid() . '_' . $fileName;
                    $targetFilePath = $uploadDir . $newFileName;
                    
                    if (move_uploaded_file($tmpName, $targetFilePath)) {
                        $imagePaths[] = $targetFilePath;
                    }
                }
            }
        }
        
        // 2. จัดการรูปภาพ Banner (บันทึกพาธลง DB)
        if (isset($files['image_banner']) && $files['image_banner']['error'] === UPLOAD_ERR_OK) {
            $tmpName = $files['image_banner']['tmp_name'];
            $fileName = basename($files['image_banner']['name']);
            $ext = pathinfo($fileName, PATHINFO_EXTENSION);
            $newFileName = 'banner_' . $productCode . '_' . uniqid() . '.' . $ext;
            $targetFilePath = $uploadDir . $newFileName;
            
            if (move_uploaded_file($tmpName, $targetFilePath)) {
                $imageBannerPath = $targetFilePath;
            }
        }
        
        // แปลง Array ของที่อยู่รูปภาพเป็น JSON เพื่อเก็บลงคอลัมน์เดียว
        $imageProductsJson = json_encode($imagePaths, JSON_UNESCAPED_UNICODE);

        // --- ส่วนบันทึกข้อมูลลงตาราง products ---
        $sql = "INSERT INTO products (product_code, name, price, stock_balance, description, sale_status, image_products, image_banner) 
                VALUES (:product_code, :name, :price, :stock, :description, :sale_status, :image_products, :image_banner)";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':product_code'   => $productCode,
            ':name'           => $data['name'],
            ':price'          => $data['price'],
            ':stock'          => $data['stock'],
            ':description'    => $data['description'],
            ':sale_status'    => $data['sale_status'],
            ':image_products' => $imageProductsJson,
            ':image_banner'   => $imageBannerPath
        ]);

        $productId = $pdo->lastInsertId(); // ดึง ID ของสินค้าที่เพิ่งเพิ่มเข้าไป
        
        return ["status" => "success", "message" => "เพิ่มสินค้าและรูปภาพเรียบร้อยแล้ว", "product_id" => $productId];
    } catch (PDOException $e) {
        return ["status" => "error", "message" => "เกิดข้อผิดพลาดในการเพิ่มสินค้า: " . $e->getMessage()];
    }
}

// ==========================================
// 3. ฟังก์ชัน UPDATE: แก้ไขข้อมูลสินค้า (Update Product)
// ==========================================
function updateProduct($pdo, $data, $files, $postData) {
    try {
        $productId = $data['id'];
        $uploadDir = 'uploads/';
        
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        // ดึงข้อมูลสินค้าเดิมมาเพื่อเช็ครูปภาพเก่า
        $stmt = $pdo->prepare("SELECT product_code, image_products, image_banner FROM products WHERE product_id = ?");
        $stmt->execute([$productId]);
        $existingProduct = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$existingProduct) {
            return ["status" => "error", "message" => "ไม่พบสินค้าที่ต้องการแก้ไข"];
        }

        // ==========================================
        // จัดการรูปภาพสินค้า (Product Images) แบบรวมของเก่า+ใหม่
        // ==========================================
        $finalImages = [];

        // 1. รับค่ารูปภาพเก่าที่ไม่โดนลบ (จาก Frontend ที่ส่งมาเป็น Array)
        if (isset($postData['existing_images']) && is_array($postData['existing_images'])) {
            $finalImages = $postData['existing_images']; 
        }

        // 2. รับค่าและเซฟรูปภาพที่อัปโหลดใหม่
        if (isset($files['product_images']) && !empty($files['product_images']['name'][0])) {
            $fileCount = count($files['product_images']['name']);
            
            for ($i = 0; $i < $fileCount; $i++) {
                // เช็คว่ารวมกับรูปเก่าแล้วต้องไม่เกิน 5 รูป
                if (count($finalImages) >= 5) break; 
                
                $tmpName = $files['product_images']['tmp_name'][$i];
                $fileName = basename($files['product_images']['name'][$i]);
                
                if ($tmpName != "") {
                    $newFileName = uniqid() . '_' . $fileName;
                    $targetFilePath = $uploadDir . $newFileName;
                    
                    if (move_uploaded_file($tmpName, $targetFilePath)) {
                        $finalImages[] = $targetFilePath; // เพิ่มรูปใหม่เข้าไปใน Array
                    }
                }
            }
        }
        
        // แปลงเป็น JSON เตรียมอัปเดตลงฐานข้อมูล
        $imageProductsJson = json_encode($finalImages, JSON_UNESCAPED_UNICODE);

        // ==========================================
        // จัดการรูปภาพ Banner
        // ==========================================
        $imageBannerPath = $existingProduct['image_banner']; // ค่าเริ่มต้นใช้รูปเดิม

        if (isset($files['image_banner']) && $files['image_banner']['error'] === UPLOAD_ERR_OK) {
            $tmpName = $files['image_banner']['tmp_name'];
            $fileName = basename($files['image_banner']['name']);
            $ext = pathinfo($fileName, PATHINFO_EXTENSION);
            $newFileName = 'banner_' . $existingProduct['product_code'] . '_update_' . uniqid() . '.' . $ext;
            $targetFilePath = $uploadDir . $newFileName;
            
            if (move_uploaded_file($tmpName, $targetFilePath)) {
                $imageBannerPath = $targetFilePath; // เขียนทับด้วยพาร์ทรูปใหม่
            }
        }

        // ==========================================
        // อัปเดตข้อมูลในตาราง
        // ==========================================
        $sql = "UPDATE products SET 
                    name = :name, 
                    price = :price, 
                    stock_balance = :stock, 
                    description = :description, 
                    sale_status = :sale_status,
                    image_products = :image_products,
                    image_banner = :image_banner
                WHERE product_id = :product_id";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':name'           => $data['name'],
            ':price'          => $data['price'],
            ':stock'          => $data['stock'],
            ':description'    => $data['description'],
            ':sale_status'    => $data['sale_status'],
            ':image_products' => $imageProductsJson,
            ':image_banner'   => $imageBannerPath,
            ':product_id'     => $productId
        ]);

        return ["status" => "success", "message" => "อัปเดตข้อมูลและรูปภาพสำเร็จ"];
    } catch (PDOException $e) {
        return ["status" => "error", "message" => "อัปเดตล้มเหลว: " . $e->getMessage()];
    }
}

// ==========================================
// 4. ฟังก์ชัน DELETE: ลบข้อมูลสินค้า (Delete Product)
// ==========================================
function deleteProduct($pdo, $productId) {
    try {
        // ดึงข้อมูลรูปภาพเพื่อทำการลบไฟล์ออกจากเซิร์ฟเวอร์
        $stmt = $pdo->prepare("SELECT image_products, image_banner FROM products WHERE product_id = ?");
        $stmt->execute([$productId]);
        $product = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($product) {
            // ลบไฟล์รูปภาพสินค้า
            if (!empty($product['image_products'])) {
                $images = json_decode($product['image_products'], true);
                if (is_array($images)) {
                    foreach ($images as $img) {
                        if (file_exists($img)) {
                            unlink($img);
                        }
                    }
                }
            }
            
            // ลบไฟล์รูปภาพ Banner
            if (!empty($product['image_banner']) && file_exists($product['image_banner'])) {
                unlink($product['image_banner']);
            }
        }

        // ลบข้อมูลออกจากฐานข้อมูล
        $stmt = $pdo->prepare("DELETE FROM products WHERE product_id = ?");
        $stmt->execute([$productId]);

        return ["status" => "success", "message" => "ลบสินค้าเรียบร้อยแล้ว"];
    } catch (PDOException $e) {
        return ["status" => "error", "message" => "เกิดข้อผิดพลาดในการลบสินค้า: " . $e->getMessage()];
    }
}

// ==========================================
// 5. ฟังก์ชัน SELECT: ดึงข้อมูลสต๊อก (Stock)
// ==========================================
function getStockList($pdo) {
    try {
        // ดึงข้อมูลทั้งหมดรวมถึง image_banner
        $sql = "SELECT * FROM products ORDER BY product_id DESC";
        $stmt = $pdo->query($sql);
        $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        return ["status" => "success", "data" => $products];
    } catch (PDOException $e) {
        return ["status" => "error", "message" => "เกิดข้อผิดพลาดในการดึงข้อมูลสต๊อก: " . $e->getMessage()];
    }
}

// ==========================================
// 6. ฟังก์ชัน SELECT: ดึงข้อมูลรายการสั่งซื้อ (Orders)
// ==========================================
function getOrderList($pdo) {
    try {
        $sql = "SELECT 
                    o.created_at, 
                    o.order_code, 
                    p.product_code, 
                    o.customer_name, 
                    o.address, 
                    o.phone, 
                    o.email, 
                    oi.quantity AS amount, 
                    o.payment_status, 
                    o.order_status
                FROM orders o
                JOIN order_items oi ON o.order_id = oi.order_id
                JOIN products p ON oi.product_id = p.product_id
                ORDER BY o.created_at DESC";
                
        $stmt = $pdo->query($sql);
        $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        return ["status" => "success", "data" => $orders];
    } catch (PDOException $e) {
        return ["status" => "error", "message" => "เกิดข้อผิดพลาดในการดึงข้อมูลสั่งซื้อ: " . $e->getMessage()];
    }
}

// ==========================================
// 7. API Routing (รับ-ส่งข้อมูลกับ Frontend)
// ==========================================
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $action = isset($_GET['action']) ? $_GET['action'] : '';
    
    if ($action === 'get_stock') {
        echo json_encode(getStockList($pdo));
        exit;
    } 
    elseif ($action === 'get_orders') {
        echo json_encode(getOrderList($pdo));
        exit;
    }
} 
elseif ($method === 'POST') {
    // รองรับการส่งข้อมูลมาแบบ JSON
    $inputJSON = file_get_contents('php://input');
    $input = json_decode($inputJSON, true);
    
    if (is_array($input)) {
        $_POST = array_merge($_POST, $input);
    }

    $action = isset($_POST['action']) ? $_POST['action'] : '';
    
    // --- เพิ่มสินค้า ---
    if ($action === 'add_product') {
        $productData = [
            'name' => isset($_POST['product_name']) ? trim($_POST['product_name']) : '',
            'price' => isset($_POST['product_price']) ? floatval($_POST['product_price']) : 0,
            'stock' => isset($_POST['product_stock']) ? intval($_POST['product_stock']) : 0,
            'description' => isset($_POST['product_details']) ? trim($_POST['product_details']) : '',
            'sale_status' => isset($_POST['sale_status']) ? $_POST['sale_status'] : 'open'
        ];
        
        echo json_encode(addProduct($pdo, $productData, $_FILES));
        exit;
    }
    // --- อัปเดตสินค้า ---
    elseif ($action === 'update_product') {
        $updateData = [
            'id'          => isset($_POST['product_id']) ? intval($_POST['product_id']) : 0,
            'name'        => isset($_POST['product_name']) ? trim($_POST['product_name']) : '',
            'price'       => isset($_POST['product_price']) ? floatval($_POST['product_price']) : 0,
            'stock'       => isset($_POST['product_stock']) ? intval($_POST['product_stock']) : 0,
            'description' => isset($_POST['product_details']) ? trim($_POST['product_details']) : '',
            'sale_status' => isset($_POST['sale_status']) ? $_POST['sale_status'] : 'open'
        ];
        
        // ส่ง $_POST ไปด้วยเพื่อให้เข้าถึง existing_images[] ที่รับค่ามาจากหน้าแก้ไข
        echo json_encode(updateProduct($pdo, $updateData, $_FILES, $_POST));
        exit;
    }
    // --- ลบสินค้า ---
    elseif ($action === 'delete_product') {
        $productId = isset($_POST['product_id']) ? intval($_POST['product_id']) : 0;
        
        if ($productId > 0) {
            echo json_encode(deleteProduct($pdo, $productId));
        } else {
            echo json_encode(["status" => "error", "message" => "ไม่พบรหัสสินค้าที่ต้องการลบ"]);
        }
        exit;
    }
}

// หากไม่ตรงกับเงื่อนไขใดๆ เลย
echo json_encode(["status" => "error", "message" => "Invalid API Action"]);
?>