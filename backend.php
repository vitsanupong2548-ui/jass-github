<?php
/**
 * ไฟล์นี้เป็นโครงสร้าง PHP สำหรับเชื่อมต่อกับ Frontend และ MySQL
 */

// --- ตั้งค่า CORS เพื่อรองรับการทดสอบข้ามโดเมน (เช่น รันผ่าน Canvas) ---
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');
}
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
    exit(0);
}

$host = 'localhost';
$user = 'root';
$pass = '';
$dbname = 'music_admin_db';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    die(json_encode(['status' => 'error', 'message' => 'Database connection failed.']));
}

session_start();
$action = isset($_GET['action']) ? $_GET['action'] : '';
header('Content-Type: application/json');

switch($action) {
    
    // --- ระบบสมัครสมาชิก ---
    case 'register':
        $username = $_POST['username'] ?? '';
        $email = $_POST['email'] ?? '';
        $password = $_POST['password'] ?? '';
        
        if(empty($username) || empty($email) || empty($password)) {
            echo json_encode(['status' => 'error', 'message' => 'กรุณากรอกข้อมูลให้ครบถ้วน']);
            break;
        }

        $stmt = $pdo->prepare("SELECT id FROM users WHERE username = ? OR email = ?");
        $stmt->execute([$username, $email]);
        if($stmt->rowCount() > 0) {
            echo json_encode(['status' => 'error', 'message' => 'ชื่อผู้ใช้ หรือ อีเมลนี้ มีในระบบแล้ว']);
            break;
        }

        $hashed_password = password_hash($password, PASSWORD_BCRYPT);
        $stmt = $pdo->prepare("INSERT INTO users (username, password, email, role, status) VALUES (?, ?, ?, 'user', 'pending')");
        
        if($stmt->execute([$username, $hashed_password, $email])) {
            echo json_encode(['status' => 'success', 'message' => 'สมัครสมาชิกสำเร็จ โปรดรอผู้ดูแลระบบอนุมัติ']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'เกิดข้อผิดพลาดในการสมัครสมาชิก']);
        }
        break;

    // --- ระบบ Login ---
    case 'login':
        $username = $_POST['username'] ?? '';
        $password = $_POST['password'] ?? '';
        
        $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
        $stmt->execute([$username]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($user && password_verify($password, $user['password'])) {
            if($user['status'] == 'pending') {
                echo json_encode(['status' => 'error', 'message' => 'บัญชีของคุณกำลังรอการอนุมัติ']);
            } else {
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['role'] = $user['role'];
                echo json_encode(['status' => 'success', 'message' => 'Login successful', 'role' => $user['role']]);
            }
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Username หรือ Password ไม่ถูกต้อง']);
        }
        break;

    // --- ดึงข้อมูล Users มาแสดงในตาราง ---
    case 'get_users':
        if(!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
            die(json_encode(['status' => 'error', 'message' => 'Unauthorized']));
        }
        $stmt = $pdo->query("SELECT id, username, email, role, status FROM users");
        echo json_encode(['status' => 'success', 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
        break;

    // --- อนุมัติผู้ใช้งาน / เปลี่ยนสถานะ ---
    case 'update_user_status':
        if(!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
            die(json_encode(['status' => 'error', 'message' => 'Unauthorized']));
        }
        $user_id = $_POST['user_id'];
        $new_status = $_POST['status']; 
        
        $stmt = $pdo->prepare("UPDATE users SET status = ? WHERE id = ?");
        if($stmt->execute([$new_status, $user_id])) {
            echo json_encode(['status' => 'success']);
        }
        break;

    // --- ลบผู้ใช้งานโดย Admin ---
    case 'delete_user':
        if(!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
            die(json_encode(['status' => 'error', 'message' => 'Unauthorized']));
        }
        $user_id = $_POST['user_id'];
        $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
        if($stmt->execute([$user_id])) {
            echo json_encode(['status' => 'success', 'message' => 'ลบผู้ใช้งานสำเร็จ']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'ไม่สามารถลบข้อมูลได้']);
        }
        break;

    // --- เปลี่ยนรหัสผ่านโดย Admin ---
    case 'update_password':
        if(!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
            die(json_encode(['status' => 'error', 'message' => 'Unauthorized']));
        }
        $user_id = $_POST['user_id'];
        $new_password = $_POST['new_password'] ?? '';
        
        if(empty($new_password)) {
            echo json_encode(['status' => 'error', 'message' => 'กรุณากรอกรหัสผ่านใหม่']);
            break;
        }

        $hashed_password = password_hash($new_password, PASSWORD_BCRYPT);
        $stmt = $pdo->prepare("UPDATE users SET password = ? WHERE id = ?");
        if($stmt->execute([$hashed_password, $user_id])) {
            echo json_encode(['status' => 'success', 'message' => 'อัปเดตรหัสผ่านใหม่เรียบร้อยแล้ว']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'ไม่สามารถเปลี่ยนรหัสผ่านได้']);
        }
        break;

    // --- ระบบบันทึกข้อมูล Event ---
    case 'save_event':
        $title = $_POST['title'] ?? '';
        $short_desc = $_POST['short_description'] ?? '';
        $start_date = $_POST['start_date'] ?? '';
        $end_date = $_POST['end_date'] ?? '';
        $location = $_POST['location'] ?? '';
        $details = $_POST['details'] ?? '';
        
        if(empty(trim($start_date))) $start_date = date('Y-m-d H:i:s');
        if(empty(trim($end_date))) $end_date = date('Y-m-d H:i:s');

        $upload_dir = 'uploads/events/';
        if (!file_exists($upload_dir)) mkdir($upload_dir, 0777, true);

        $banner_path = null; $poster_path = null; $venue_path = null;
        $gallery_paths = []; 

        if (isset($_FILES['banner_image']) && $_FILES['banner_image']['error'] === UPLOAD_ERR_OK) {
            $ext = pathinfo($_FILES['banner_image']['name'], PATHINFO_EXTENSION);
            $banner_path = $upload_dir . 'banner_' . time() . '_' . uniqid() . '.' . $ext;
            move_uploaded_file($_FILES['banner_image']['tmp_name'], $banner_path);
        }
        if (isset($_FILES['poster_image']) && $_FILES['poster_image']['error'] === UPLOAD_ERR_OK) {
            $ext = pathinfo($_FILES['poster_image']['name'], PATHINFO_EXTENSION);
            $poster_path = $upload_dir . 'poster_' . time() . '_' . uniqid() . '.' . $ext;
            move_uploaded_file($_FILES['poster_image']['tmp_name'], $poster_path);
        }
        if (isset($_FILES['venue_image']) && $_FILES['venue_image']['error'] === UPLOAD_ERR_OK) {
            $ext = pathinfo($_FILES['venue_image']['name'], PATHINFO_EXTENSION);
            $venue_path = $upload_dir . 'venue_' . time() . '_' . uniqid() . '.' . $ext;
            move_uploaded_file($_FILES['venue_image']['tmp_name'], $venue_path);
        }

        if (isset($_FILES['gallery_images'])) {
            $total_files = min(count($_FILES['gallery_images']['name']), 10); 
            for ($i = 0; $i < $total_files; $i++) {
                if ($_FILES['gallery_images']['error'][$i] === UPLOAD_ERR_OK) {
                    $ext = pathinfo($_FILES['gallery_images']['name'][$i], PATHINFO_EXTENSION);
                    $g_path = $upload_dir . 'gallery_' . time() . '_' . uniqid() . '_' . $i . '.' . $ext;
                    if (move_uploaded_file($_FILES['gallery_images']['tmp_name'][$i], $g_path)) {
                        $gallery_paths[] = $g_path;
                    }
                }
            }
        }
        $gallery_json = json_encode($gallery_paths);

        try {
            $pdo->beginTransaction();

            $stmt = $pdo->prepare("INSERT INTO events (title, short_description, start_date, end_date, location, details, banner_image, poster_image, venue_image, gallery_images) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([$title, $short_desc, $start_date, $end_date, $location, $details, $banner_path, $poster_path, $venue_path, $gallery_json]);
            $event_id = $pdo->lastInsertId();

            if (isset($_POST['lineup_names']) && is_array($_POST['lineup_names'])) {
                $stmt_lineup = $pdo->prepare("INSERT INTO event_lineups (event_id, lineup_date, lineup_time, band_name) VALUES (?, ?, ?, ?)");
                $dates = $_POST['lineup_dates'] ?? [];
                $times = $_POST['lineup_times'] ?? [];
                $names = $_POST['lineup_names'] ?? [];

                for ($i = 0; $i < count($names); $i++) {
                    $l_name = trim($names[$i]);
                    if (empty($l_name)) continue;

                    $l_date = empty(trim($dates[$i] ?? '')) ? null : trim($dates[$i]);
                    $l_time = empty(trim($times[$i] ?? '')) ? null : trim($times[$i]);
                    $stmt_lineup->execute([$event_id, $l_date, $l_time, $l_name]);
                }
            }

            if (isset($_POST['ticket_titles']) && is_array($_POST['ticket_titles'])) {
                $stmt_ticket = $pdo->prepare("INSERT INTO event_tickets (event_id, title, details, price, amount, is_open) VALUES (?, ?, ?, ?, ?, ?)");
                
                $t_titles = $_POST['ticket_titles'] ?? [];
                $t_details = $_POST['ticket_details'] ?? [];
                $t_prices = $_POST['ticket_prices'] ?? [];
                $t_amounts = $_POST['ticket_amounts'] ?? [];
                $t_status = $_POST['ticket_status'] ?? [];

                for ($i = 0; $i < count($t_titles); $i++) {
                    $t_title = trim($t_titles[$i]);
                    if (empty($t_title)) continue;

                    $t_detail = trim($t_details[$i] ?? '');
                    $t_price = floatval($t_prices[$i] ?? 0);
                    $t_amount = intval($t_amounts[$i] ?? 0);
                    $t_is_open = ($t_status[$i] ?? '1') === '1' ? 1 : 0;

                    $stmt_ticket->execute([$event_id, $t_title, $t_detail, $t_price, $t_amount, $t_is_open]);
                }
            }

            $pdo->commit();
            echo json_encode(['status' => 'success', 'message' => 'บันทึกข้อมูล Event, Line Up และ Ticket สำเร็จ!']);

        } catch (Exception $e) {
            $pdo->rollBack();
            echo json_encode(['status' => 'error', 'message' => 'เกิดข้อผิดพลาดจากฐานข้อมูล: ' . $e->getMessage()]);
        }
        break;

    // --- ระบบบันทึกข้อมูล Musician Network ---
    case 'save_musician':
        $network_type = $_POST['network_type'] ?? 'artist_library';
        $title = $_POST['title'] ?? '';
        $genre = $_POST['genre'] ?? '';
        $facebook = $_POST['facebook'] ?? '';
        $whatsapp = $_POST['whatsapp'] ?? '';
        $instagram = $_POST['instagram'] ?? '';
        $website = $_POST['website'] ?? '';
        $tiktok = $_POST['tiktok'] ?? '';
        $email = $_POST['email'] ?? '';
        $details = $_POST['details'] ?? '';
        
        $video_links = isset($_POST['video_links']) ? json_encode($_POST['video_links']) : '[]';

        $upload_dir = 'uploads/musicians/';
        if (!file_exists($upload_dir)) mkdir($upload_dir, 0777, true);

        $banner_path = null; 
        $profile_path = null;

        if (isset($_FILES['banner_image']) && $_FILES['banner_image']['error'] === UPLOAD_ERR_OK) {
            $ext = pathinfo($_FILES['banner_image']['name'], PATHINFO_EXTENSION);
            $banner_path = $upload_dir . 'banner_' . time() . '_' . uniqid() . '.' . $ext;
            move_uploaded_file($_FILES['banner_image']['tmp_name'], $banner_path);
        }

        if (isset($_FILES['profile_image']) && $_FILES['profile_image']['error'] === UPLOAD_ERR_OK) {
            $ext = pathinfo($_FILES['profile_image']['name'], PATHINFO_EXTENSION);
            $profile_path = $upload_dir . 'profile_' . time() . '_' . uniqid() . '.' . $ext;
            move_uploaded_file($_FILES['profile_image']['tmp_name'], $profile_path);
        }

        try {
            $stmt = $pdo->prepare("INSERT INTO musicians (network_type, title, genre, details, facebook, whatsapp, instagram, website, tiktok, email, video_link, banner_image, profile_image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([$network_type, $title, $genre, $details, $facebook, $whatsapp, $instagram, $website, $tiktok, $email, $video_links, $banner_path, $profile_path]);
            
            echo json_encode(['status' => 'success', 'message' => 'บันทึกข้อมูล Musician สำเร็จ!']);
        } catch (Exception $e) {
            echo json_encode(['status' => 'error', 'message' => 'เกิดข้อผิดพลาดจากฐานข้อมูล: ' . $e->getMessage()]);
        }
        break;

    // --- ระบบบันทึกข้อมูล CMBigband ---
    case 'save_cmbigband':
        $title = $_POST['title'] ?? '';
        $genre = $_POST['genre'] ?? '';
        $facebook = $_POST['facebook'] ?? '';
        $whatsapp = $_POST['whatsapp'] ?? '';
        $instagram = $_POST['instagram'] ?? '';
        $website = $_POST['website'] ?? '';
        $tiktok = $_POST['tiktok'] ?? '';
        $email = $_POST['email'] ?? '';
        $details = $_POST['details'] ?? '';
        
        $video_links = isset($_POST['video_links']) ? json_encode($_POST['video_links']) : '[]';

        $upload_dir = 'uploads/cmbigband/';
        if (!file_exists($upload_dir)) mkdir($upload_dir, 0777, true);

        $banner_path = null; 
        $profile_path = null;

        if (isset($_FILES['banner_image']) && $_FILES['banner_image']['error'] === UPLOAD_ERR_OK) {
            $ext = pathinfo($_FILES['banner_image']['name'], PATHINFO_EXTENSION);
            $banner_path = $upload_dir . 'banner_' . time() . '_' . uniqid() . '.' . $ext;
            move_uploaded_file($_FILES['banner_image']['tmp_name'], $banner_path);
        }

        if (isset($_FILES['profile_image']) && $_FILES['profile_image']['error'] === UPLOAD_ERR_OK) {
            $ext = pathinfo($_FILES['profile_image']['name'], PATHINFO_EXTENSION);
            $profile_path = $upload_dir . 'profile_' . time() . '_' . uniqid() . '.' . $ext;
            move_uploaded_file($_FILES['profile_image']['tmp_name'], $profile_path);
        }

        try {
            // สร้างตาราง cmbigband อัตโนมัติหากยังไม่มีในฐานข้อมูล
            $pdo->exec("CREATE TABLE IF NOT EXISTS `cmbigband` (
              `id` int(11) NOT NULL AUTO_INCREMENT,
              `title` varchar(255) NOT NULL,
              `genre` varchar(100),
              `details` text,
              `facebook` varchar(255),
              `whatsapp` varchar(255),
              `instagram` varchar(255),
              `website` varchar(255),
              `tiktok` varchar(255),
              `email` varchar(100),
              `video_link` text,
              `banner_image` varchar(255),
              `profile_image` varchar(255),
              `created_at` timestamp DEFAULT current_timestamp(),
              PRIMARY KEY (`id`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");

            $stmt = $pdo->prepare("INSERT INTO cmbigband (title, genre, details, facebook, whatsapp, instagram, website, tiktok, email, video_link, banner_image, profile_image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([$title, $genre, $details, $facebook, $whatsapp, $instagram, $website, $tiktok, $email, $video_links, $banner_path, $profile_path]);
            
            echo json_encode(['status' => 'success', 'message' => 'บันทึกข้อมูล CMBigband สำเร็จ!']);
        } catch (Exception $e) {
            echo json_encode(['status' => 'error', 'message' => 'เกิดข้อผิดพลาดจากฐานข้อมูล: ' . $e->getMessage()]);
        }
        break;

    // --- ระบบบันทึกข้อมูล Courses Library ---
    case 'save_course':
        $title = $_POST['title'] ?? '';
        $creator = $_POST['creator'] ?? '';
        
        $upload_dir = 'uploads/courses/';
        if (!file_exists($upload_dir)) mkdir($upload_dir, 0777, true);

        $banner_path = null;
        if (isset($_FILES['banner_image']) && $_FILES['banner_image']['error'] === UPLOAD_ERR_OK) {
            $ext = pathinfo($_FILES['banner_image']['name'], PATHINFO_EXTENSION);
            $banner_path = $upload_dir . 'course_banner_' . time() . '_' . uniqid() . '.' . $ext;
            move_uploaded_file($_FILES['banner_image']['tmp_name'], $banner_path);
        }

        // จัดการเนื้อหาแบบไดนามิกที่เพิ่มเข้ามา (Text, Image, Video)
        $content_array = [];
        if (isset($_POST['content_types']) && is_array($_POST['content_types'])) {
            $types = $_POST['content_types'];
            $values = $_POST['content_values'] ?? [];

            for ($i = 0; $i < count($types); $i++) {
                $type = $types[$i];
                $value = $values[$i] ?? '';

                if ($type === 'image') {
                    // รับไฟล์รูปภาพย่อยใน Course
                    $file_key = "content_images_{$i}";
                    if (isset($_FILES[$file_key]) && $_FILES[$file_key]['error'] === UPLOAD_ERR_OK) {
                        $ext = pathinfo($_FILES[$file_key]['name'], PATHINFO_EXTENSION);
                        $img_path = $upload_dir . 'course_content_' . time() . '_' . uniqid() . '.' . $ext;
                        move_uploaded_file($_FILES[$file_key]['tmp_name'], $img_path);
                        
                        // บันทึก Path ของรูปภาพลง Array เนื้อหา
                        $content_array[] = ['type' => 'image', 'value' => $img_path];
                    }
                } else if ($type === 'text' || $type === 'video') {
                    if (!empty(trim($value))) {
                        $content_array[] = ['type' => $type, 'value' => trim($value)];
                    }
                }
            }
        }
        
        // แปลง Array ทั้งหมดเป็น JSON เพื่อเก็บลงฟิลด์ `details` คอลัมน์เดียว
        $details_json = json_encode($content_array, JSON_UNESCAPED_UNICODE);

        try {
            $stmt = $pdo->prepare("INSERT INTO courses (title, creator, details, banner_image) VALUES (?, ?, ?, ?)");
            $stmt->execute([$title, $creator, $details_json, $banner_path]);
            
            echo json_encode(['status' => 'success', 'message' => 'บันทึกคอร์สเรียนและข้อมูลทั้งหมดสำเร็จ!']);
        } catch (Exception $e) {
            echo json_encode(['status' => 'error', 'message' => 'เกิดข้อผิดพลาดจากฐานข้อมูล: ' . $e->getMessage()]);
        }
        break;
case 'get_front_events':
        try {
            // 1. ดึงข้อมูลอีเวนต์
            $stmt = $pdo->query("SELECT * FROM events WHERE start_date >= CURDATE() ORDER BY start_date ASC LIMIT 4");
            $events = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // 2. ลูปดึง Ticket และ Line up ของแต่ละอีเวนต์พ่วงไปด้วย
            foreach ($events as &$event) {
                $ev_id = $event['id'];

                // ดึงบัตร (Ticket)
                $stmt_t = $pdo->prepare("SELECT * FROM event_tickets WHERE event_id = ?");
                $stmt_t->execute([$ev_id]);
                $event['tickets'] = $stmt_t->fetchAll(PDO::FETCH_ASSOC);

                // ดึงตารางวงดนตรี (Lineup)
                $stmt_l = $pdo->prepare("SELECT * FROM event_lineups WHERE event_id = ? ORDER BY lineup_date ASC, lineup_time ASC");
                $stmt_l->execute([$ev_id]);
                $event['lineups'] = $stmt_l->fetchAll(PDO::FETCH_ASSOC);
            }

            echo json_encode(['status' => 'success', 'data' => $events]);
        } catch (Exception $e) {
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
        break;
    default:
    
        echo json_encode(['status' => 'error', 'message' => 'Invalid action']);
}
?>