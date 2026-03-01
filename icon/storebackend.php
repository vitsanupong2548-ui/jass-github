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
        $productCode = uniqid('HKL'); 
        $imagePaths = [];
        $imageBannerPath = null;
        $uploadDir = 'uploads/';
        
        if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);

        if (isset($files['product_images']) && !empty($files['product_images']['name'][0])) {
            $fileCount = count($files['product_images']['name']);
            for ($i = 0; $i < $fileCount; $i++) {
                if ($i >= 5) break; 
                $tmpName = $files['product_images']['tmp_name'][$i];
                $fileName = basename($files['product_images']['name'][$i]);
                if ($tmpName != "") {
                    $newFileName = uniqid() . '_' . $fileName;
                    $targetFilePath = $uploadDir . $newFileName;
                    if (move_uploaded_file($tmpName, $targetFilePath)) {
                        $imagePaths[] = $targetFilePath;
                    }
                }
            }
        }
        
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
        
        $imageProductsJson = json_encode($imagePaths, JSON_UNESCAPED_UNICODE);

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

        return ["status" => "success", "message" => "เพิ่มสินค้าเรียบร้อยแล้ว", "product_id" => $pdo->lastInsertId()];
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
        if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);

        $stmt = $pdo->prepare("SELECT product_code, image_products, image_banner FROM products WHERE product_id = ?");
        $stmt->execute([$productId]);
        $existingProduct = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$existingProduct) return ["status" => "error", "message" => "ไม่พบสินค้าที่ต้องการแก้ไข"];

        $finalImages = [];
        if (isset($postData['existing_images']) && is_array($postData['existing_images'])) {
            $finalImages = $postData['existing_images']; 
        }

        if (isset($files['product_images']) && !empty($files['product_images']['name'][0])) {
            $fileCount = count($files['product_images']['name']);
            for ($i = 0; $i < $fileCount; $i++) {
                if (count($finalImages) >= 5) break; 
                $tmpName = $files['product_images']['tmp_name'][$i];
                $fileName = basename($files['product_images']['name'][$i]);
                if ($tmpName != "") {
                    $newFileName = uniqid() . '_' . $fileName;
                    $targetFilePath = $uploadDir . $newFileName;
                    if (move_uploaded_file($tmpName, $targetFilePath)) {
                        $finalImages[] = $targetFilePath; 
                    }
                }
            }
        }
        
        $imageProductsJson = json_encode($finalImages, JSON_UNESCAPED_UNICODE);
        $imageBannerPath = $existingProduct['image_banner'];

        if (isset($files['image_banner']) && $files['image_banner']['error'] === UPLOAD_ERR_OK) {
            $tmpName = $files['image_banner']['tmp_name'];
            $fileName = basename($files['image_banner']['name']);
            $ext = pathinfo($fileName, PATHINFO_EXTENSION);
            $newFileName = 'banner_' . $existingProduct['product_code'] . '_update_' . uniqid() . '.' . $ext;
            $targetFilePath = $uploadDir . $newFileName;
            if (move_uploaded_file($tmpName, $targetFilePath)) {
                $imageBannerPath = $targetFilePath;
            }
        }

        $sql = "UPDATE products SET name = :name, price = :price, stock_balance = :stock, description = :description, sale_status = :sale_status, image_products = :image_products, image_banner = :image_banner WHERE product_id = :product_id";
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

        return ["status" => "success", "message" => "อัปเดตข้อมูลสำเร็จ"];
    } catch (PDOException $e) {
        return ["status" => "error", "message" => "อัปเดตล้มเหลว: " . $e->getMessage()];
    }
}

// ==========================================
// 4. ฟังก์ชัน DELETE: ลบข้อมูลสินค้า (Delete Product)
// ==========================================
function deleteProduct($pdo, $productId) {
    try {
        $stmt = $pdo->prepare("SELECT image_products, image_banner FROM products WHERE product_id = ?");
        $stmt->execute([$productId]);
        $product = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($product) {
            if (!empty($product['image_products'])) {
                $images = json_decode($product['image_products'], true);
                if (is_array($images)) {
                    foreach ($images as $img) if (file_exists($img)) unlink($img);
                }
            }
            if (!empty($product['image_banner']) && file_exists($product['image_banner'])) {
                unlink($product['image_banner']);
            }
        }

        $stmt = $pdo->prepare("DELETE FROM products WHERE product_id = ?");
        $stmt->execute([$productId]);

        return ["status" => "success", "message" => "ลบสินค้าเรียบร้อยแล้ว"];
    } catch (PDOException $e) {
        return ["status" => "error", "message" => "เกิดข้อผิดพลาดในการลบ: " . $e->getMessage()];
    }
}

// ==========================================
// 5. ฟังก์ชัน GET: Store (Stock & Orders)
// ==========================================
function getStockList($pdo) {
    try {
        $stmt = $pdo->query("SELECT * FROM products ORDER BY product_id DESC");
        return ["status" => "success", "data" => $stmt->fetchAll(PDO::FETCH_ASSOC)];
    } catch (PDOException $e) {
        return ["status" => "error", "message" => $e->getMessage()];
    }
}

function getOrderList($pdo) {
    try {
        $sql = "SELECT o.order_id, o.created_at, o.order_code, p.product_code, o.customer_name, o.address, o.phone, o.email, oi.quantity AS amount, o.payment_status, o.order_status
                FROM orders o
                JOIN order_items oi ON o.order_id = oi.order_id
                JOIN products p ON oi.product_id = p.product_id
                ORDER BY o.created_at DESC";
        $stmt = $pdo->query($sql);
        return ["status" => "success", "data" => $stmt->fetchAll(PDO::FETCH_ASSOC)];
    } catch (PDOException $e) {
        return ["status" => "error", "message" => $e->getMessage()];
    }
}

// ==========================================
// 6. ฟังก์ชัน GET: Ticket (Dashboard & Orders)
// ==========================================
function getTicketEventsList($pdo) {
    try {
        $sql = "SELECT t.id AS ticket_id, t.title AS ticket_title, t.price, t.amount, t.is_open, e.title AS event_title 
                FROM event_tickets t 
                LEFT JOIN events e ON t.event_id = e.id 
                ORDER BY t.id DESC";
        $stmt = $pdo->query($sql);
        return ["status" => "success", "data" => $stmt->fetchAll(PDO::FETCH_ASSOC)];
    } catch (PDOException $e) {
        return ["status" => "error", "message" => $e->getMessage()];
    }
}

// ฟังก์ชันใหม่สำหรับดึงจำนวนการสั่งซื้อของตั๋ว
function getTicketOrderCount($pdo, $ticketId) {
    try {
        $stmt = $pdo->prepare("SELECT COUNT(*) as count FROM ticket_orders WHERE ticket_id = ?");
        $stmt->execute([$ticketId]);
        $count = $stmt->fetchColumn();
        return ["status" => "success", "count" => $count];
    } catch (PDOException $e) {
        return ["status" => "error", "message" => $e->getMessage()];
    }
}

function getTicketOrderList($pdo) {
    try {
        $sql = "SELECT 
                    t_order.order_id,
                    t_order.created_at, 
                    t_order.order_code, 
                    t_ticket.title AS ticket_name, 
                    e.title AS event_name,
                    t_order.customer_name, 
                    t_order.address, 
                    t_order.phone, 
                    t_order.email, 
                    t_order.amount, 
                    t_order.payment_status, 
                    t_order.order_status
                FROM ticket_orders t_order
                LEFT JOIN event_tickets t_ticket ON t_order.ticket_id = t_ticket.id
                LEFT JOIN events e ON t_order.event_id = e.id
                ORDER BY t_order.created_at DESC";
        $stmt = $pdo->query($sql);
        return ["status" => "success", "data" => $stmt->fetchAll(PDO::FETCH_ASSOC)];
    } catch (PDOException $e) {
        return ["status" => "error", "message" => $e->getMessage()];
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
    } elseif ($action === 'get_orders') {
        echo json_encode(getOrderList($pdo));
        exit;
    } elseif ($action === 'get_ticket_events') {
        echo json_encode(getTicketEventsList($pdo));
        exit;
    } elseif ($action === 'get_ticket_order_count') {
        // เพิ่ม API นับจำนวน Order ตาม Event/Ticket
        $ticketId = isset($_GET['ticket_id']) ? intval($_GET['ticket_id']) : 0;
        echo json_encode(getTicketOrderCount($pdo, $ticketId));
        exit;
    } elseif ($action === 'get_ticket_orders') {
        echo json_encode(getTicketOrderList($pdo));
        exit;
    }
} 
elseif ($method === 'POST') {
    $inputJSON = file_get_contents('php://input');
    $input = json_decode($inputJSON, true);
    if (is_array($input)) $_POST = array_merge($_POST, $input);

    $action = isset($_POST['action']) ? $_POST['action'] : '';
    
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
    } elseif ($action === 'update_product') {
        $updateData = [
            'id'          => isset($_POST['product_id']) ? intval($_POST['product_id']) : 0,
            'name'        => isset($_POST['product_name']) ? trim($_POST['product_name']) : '',
            'price'       => isset($_POST['product_price']) ? floatval($_POST['product_price']) : 0,
            'stock'       => isset($_POST['product_stock']) ? intval($_POST['product_stock']) : 0,
            'description' => isset($_POST['product_details']) ? trim($_POST['product_details']) : '',
            'sale_status' => isset($_POST['sale_status']) ? $_POST['sale_status'] : 'open'
        ];
        echo json_encode(updateProduct($pdo, $updateData, $_FILES, $_POST));
        exit;
    } elseif ($action === 'delete_product') {
        $productId = isset($_POST['product_id']) ? intval($_POST['product_id']) : 0;
        echo json_encode($productId > 0 ? deleteProduct($pdo, $productId) : ["status" => "error", "message" => "ไม่พบรหัสสินค้า"]);
        exit;
    } elseif ($action === 'update_order_status') {
        $orderId = isset($_POST['order_id']) ? intval($_POST['order_id']) : 0;
        $orderType = isset($_POST['order_type']) ? $_POST['order_type'] : '';
        $field = isset($_POST['field']) ? $_POST['field'] : '';
        $value = isset($_POST['value']) ? $_POST['value'] : '';

        if ($orderId > 0 && in_array($field, ['payment_status', 'order_status'])) {
            try {
                $tableName = ($orderType === 'ticket') ? 'ticket_orders' : 'orders';
                $sql = "UPDATE {$tableName} SET {$field} = :val WHERE order_id = :id";
                $stmt = $pdo->prepare($sql);
                $stmt->execute([':val' => $value, ':id' => $orderId]);
                
                echo json_encode(["status" => "success", "message" => "อัปเดตสถานะสำเร็จ"]);
            } catch (PDOException $e) {
                echo json_encode(["status" => "error", "message" => "อัปเดตล้มเหลว: " . $e->getMessage()]);
            }
        } else {
            echo json_encode(["status" => "error", "message" => "ข้อมูลไม่ถูกต้อง"]);
        }
        exit;
    } elseif ($action === 'upload_payment_slip') {
        // --- ฟังก์ชันอัปโหลดรูปสลิป สำหรับ Order และ Ticket Order ---
        $orderId = isset($_POST['order_id']) ? intval($_POST['order_id']) : 0;
        $orderType = isset($_POST['order_type']) ? $_POST['order_type'] : ''; // 'store' หรือ 'ticket'
        $uploadDir = 'uploads/slips/'; // เก็บสลิปแยกโฟลเดอร์เพื่อความเป็นระเบียบ

        if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);

        if ($orderId > 0 && isset($_FILES['payment_slip_file']) && $_FILES['payment_slip_file']['error'] === UPLOAD_ERR_OK) {
            $tmpName = $_FILES['payment_slip_file']['tmp_name'];
            $fileName = basename($_FILES['payment_slip_file']['name']);
            $ext = pathinfo($fileName, PATHINFO_EXTENSION);
            
            // สร้างชื่อไฟล์ใหม่ เช่น slip_store_1_xxx.jpg
            $newFileName = 'slip_' . $orderType . '_' . $orderId . '_' . uniqid() . '.' . $ext;
            $targetFilePath = $uploadDir . $newFileName;

            if (move_uploaded_file($tmpName, $targetFilePath)) {
                try {
                    $tableName = ($orderType === 'ticket') ? 'ticket_orders' : 'orders';
                    
                    // (ตัวเลือก) ลบสลิปเก่าทิ้งก่อนเพื่อประหยัดพื้นที่
                    $stmt = $pdo->prepare("SELECT payment_status FROM {$tableName} WHERE order_id = ?");
                    $stmt->execute([$orderId]);
                    $oldSlip = $stmt->fetchColumn();
                    if ($oldSlip && file_exists($oldSlip)) {
                        unlink($oldSlip);
                    }

                    // อัปเดต Path รูปใหม่ลงฐานข้อมูล (ใช้คอลัมน์ payment_status แทน)
                    $sql = "UPDATE {$tableName} SET payment_status = :slip WHERE order_id = :id";
                    $stmt = $pdo->prepare($sql);
                    $stmt->execute([':slip' => $targetFilePath, ':id' => $orderId]);

                    echo json_encode(["status" => "success", "message" => "อัปโหลดสลิปสำเร็จ", "path" => $targetFilePath]);
                } catch (PDOException $e) {
                    echo json_encode(["status" => "error", "message" => "อัปเดตล้มเหลว: " . $e->getMessage()]);
                }
            } else {
                echo json_encode(["status" => "error", "message" => "อัปโหลดไฟล์ไม่สำเร็จ"]);
            }
        } else {
            echo json_encode(["status" => "error", "message" => "ข้อมูลไม่ถูกต้อง หรือไม่ได้เลือกไฟล์"]);
        }
        exit;
    }
}

echo json_encode(["status" => "error", "message" => "Invalid API Action"]);
?>