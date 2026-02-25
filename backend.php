<?php
/**
 * ไฟล์นี้เป็นโครงสร้าง PHP สำหรับเชื่อมต่อกับ Frontend และ MySQL (รองรับ 2 ภาษา EN/TH)
 */

// --- ตั้งค่า CORS เพื่อรองรับการทดสอบข้ามโดเมน ---
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
// รองรับการส่ง Action ทั้งแบบ GET และ POST
$action = isset($_GET['action']) ? $_GET['action'] : (isset($_POST['action']) ? $_POST['action'] : '');
header('Content-Type: application/json');

switch($action) {
    
    // ==========================================
    // 1. ระบบผู้ใช้งาน (USER MANAGEMENT)
    // ==========================================
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

    case 'get_users':
        if(!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
            die(json_encode(['status' => 'error', 'message' => 'Unauthorized']));
        }
        $stmt = $pdo->query("SELECT id, username, email, role, status FROM users");
        echo json_encode(['status' => 'success', 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
        break;

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

    case 'check_auth':
        if(isset($_SESSION['user_id'])) {
            echo json_encode(['status' => 'success', 'logged_in' => true, 'role' => $_SESSION['role'], 'user_id' => $_SESSION['user_id']]);
        } else {
            echo json_encode(['status' => 'success', 'logged_in' => false]);
        }
        break;

    case 'logout':
        session_destroy();
        echo json_encode(['status' => 'success']);
        break;

    // ==========================================
    // 2. ระบบ EVENT & FESTIVAL
    // ==========================================
    case 'get_event_details':
        $id = $_GET['id'] ?? '';
        try {
            $stmt = $pdo->prepare("SELECT * FROM events WHERE id = ?");
            $stmt->execute([$id]);
            $event = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($event) {
                $stmt_t = $pdo->prepare("SELECT * FROM event_tickets WHERE event_id = ?");
                $stmt_t->execute([$id]);
                $event['tickets'] = $stmt_t->fetchAll(PDO::FETCH_ASSOC);

                $stmt_l = $pdo->prepare("SELECT * FROM event_lineups WHERE event_id = ? ORDER BY lineup_date ASC, lineup_time ASC");
                $stmt_l->execute([$id]);
                $event['lineups'] = $stmt_l->fetchAll(PDO::FETCH_ASSOC);

                echo json_encode(['status' => 'success', 'data' => $event]);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'ไม่พบข้อมูล Event']);
            }
        } catch (Exception $e) {
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
        break;

    case 'save_event':
        $event_id = $_POST['event_id'] ?? ''; 
        
        // รับค่าภาษา EN
        $title = $_POST['title'] ?? '';
        $short_desc = $_POST['short_description'] ?? '';
        $details = $_POST['details'] ?? '';
        $venue_title = $_POST['venue_title'] ?? '';
        $venue_details = $_POST['venue_details'] ?? '';
        
        // รับค่าภาษา TH
        $title_th = $_POST['title_th'] ?? '';
        $short_desc_th = $_POST['short_description_th'] ?? '';
        $details_th = $_POST['details_th'] ?? '';
        $venue_title_th = $_POST['venue_title_th'] ?? '';
        $venue_details_th = $_POST['venue_details_th'] ?? '';

        $start_date = $_POST['start_date'] ?? '';
        $end_date = $_POST['end_date'] ?? '';
        $location = $_POST['location'] ?? '';
        $venue_map = $_POST['venue_map'] ?? '';
        
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

            if (!empty($event_id)) {
                // อัปเดตข้อมูลทั้ง 2 ภาษา
                $sql = "UPDATE events SET title=?, title_th=?, short_description=?, short_description_th=?, start_date=?, end_date=?, location=?, details=?, details_th=?, venue_title=?, venue_title_th=?, venue_details=?, venue_details_th=?, venue_map=?";
                $params = [$title, $title_th, $short_desc, $short_desc_th, $start_date, $end_date, $location, $details, $details_th, $venue_title, $venue_title_th, $venue_details, $venue_details_th, $venue_map];
                
                if ($banner_path) { $sql .= ", banner_image=?"; $params[] = $banner_path; }
                if ($poster_path) { $sql .= ", poster_image=?"; $params[] = $poster_path; }
                if ($venue_path) { $sql .= ", venue_image=?"; $params[] = $venue_path; }
                if (!empty($gallery_paths)) { $sql .= ", gallery_images=?"; $params[] = $gallery_json; }
                
                $sql .= " WHERE id=?";
                $params[] = $event_id;
                
                $stmt = $pdo->prepare($sql);
                $stmt->execute($params);
                
                $pdo->prepare("DELETE FROM event_lineups WHERE event_id=?")->execute([$event_id]);
                $pdo->prepare("DELETE FROM event_tickets WHERE event_id=?")->execute([$event_id]);
            } else {
                // สร้างใหม่ทั้ง 2 ภาษา
                $stmt = $pdo->prepare("INSERT INTO events (title, title_th, short_description, short_description_th, start_date, end_date, location, details, details_th, venue_title, venue_title_th, venue_details, venue_details_th, venue_map, banner_image, poster_image, venue_image, gallery_images) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                $stmt->execute([$title, $title_th, $short_desc, $short_desc_th, $start_date, $end_date, $location, $details, $details_th, $venue_title, $venue_title_th, $venue_details, $venue_details_th, $venue_map, $banner_path, $poster_path, $venue_path, $gallery_json]);
                $event_id = $pdo->lastInsertId();
            }

            if (isset($_POST['lineup_names']) && is_array($_POST['lineup_names'])) {
                $stmt_lineup = $pdo->prepare("INSERT INTO event_lineups (event_id, lineup_date, lineup_time, lineup_stage, band_name) VALUES (?, ?, ?, ?, ?)");
                $dates = $_POST['lineup_dates'] ?? [];
                $times = $_POST['lineup_times'] ?? [];
                $stages = $_POST['lineup_stages'] ?? [];
                $names = $_POST['lineup_names'] ?? [];
                
                for ($i = 0; $i < count($names); $i++) {
                    $l_name = trim($names[$i]);
                    if (empty($l_name)) continue;
                    $l_date = empty(trim($dates[$i] ?? '')) ? null : trim($dates[$i]);
                    $l_time = empty(trim($times[$i] ?? '')) ? null : trim($times[$i]);
                    $l_stage = trim($stages[$i] ?? '');
                    $stmt_lineup->execute([$event_id, $l_date, $l_time, $l_stage, $l_name]);
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
            echo json_encode(['status' => 'success', 'message' => 'บันทึกข้อมูล Event สำเร็จ!']);

        } catch (Exception $e) {
            $pdo->rollBack();
            echo json_encode(['status' => 'error', 'message' => 'เกิดข้อผิดพลาด: ' . $e->getMessage()]);
        }
        break;

    case 'get_front_events':
        try {
            $stmt = $pdo->query("SELECT * FROM events ORDER BY start_date ASC");
            $events = $stmt->fetchAll(PDO::FETCH_ASSOC);

            foreach ($events as &$event) {
                $ev_id = $event['id'];
                $stmt_t = $pdo->prepare("SELECT * FROM event_tickets WHERE event_id = ?");
                $stmt_t->execute([$ev_id]);
                $event['tickets'] = $stmt_t->fetchAll(PDO::FETCH_ASSOC);

                $stmt_l = $pdo->prepare("SELECT * FROM event_lineups WHERE event_id = ? ORDER BY lineup_date ASC, lineup_time ASC");
                $stmt_l->execute([$ev_id]);
                $event['lineups'] = $stmt_l->fetchAll(PDO::FETCH_ASSOC);
            }
            echo json_encode(['status' => 'success', 'data' => $events]);
        } catch (Exception $e) {
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
        break;

    case 'get_all_events':
        try {
            $stmt = $pdo->query("SELECT id, title, start_date, end_date FROM events ORDER BY id DESC");
            echo json_encode(['status' => 'success', 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
        } catch (Exception $e) {
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
        break;

    case 'delete_event':
        $event_id = $_POST['event_id'] ?? '';
        try {
            $pdo->prepare("DELETE FROM event_tickets WHERE event_id = ?")->execute([$event_id]);
            $pdo->prepare("DELETE FROM event_lineups WHERE event_id = ?")->execute([$event_id]);
            $pdo->prepare("DELETE FROM events WHERE id = ?")->execute([$event_id]);
            echo json_encode(['status' => 'success', 'message' => 'ลบข้อมูล Event สำเร็จ']);
        } catch (Exception $e) {
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
        break;

    // ==========================================
    // 3. ระบบ MUSICIAN NETWORK
    // ==========================================
    case 'get_all_musicians':
        try {
            $stmt = $pdo->query("SELECT * FROM musicians ORDER BY slot_number ASC, id DESC");
            echo json_encode(['status' => 'success', 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
        } catch (Exception $e) { 
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]); 
        }
        break;

    case 'get_musician_details':
        $id = $_GET['id'] ?? '';
        try {
            $stmt = $pdo->prepare("SELECT * FROM musicians WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(['status' => 'success', 'data' => $stmt->fetch(PDO::FETCH_ASSOC)]);
        } catch (Exception $e) { echo json_encode(['status' => 'error', 'message' => $e->getMessage()]); }
        break;

    case 'delete_musician':
        $id = $_POST['musician_id'] ?? '';
        try {
            $pdo->prepare("DELETE FROM musicians WHERE id = ?")->execute([$id]);
            echo json_encode(['status' => 'success', 'message' => 'ลบข้อมูลสำเร็จ']);
        } catch (Exception $e) { echo json_encode(['status' => 'error', 'message' => $e->getMessage()]); }
        break;

    case 'save_musician':
        $musician_id = $_POST['musician_id'] ?? ''; 
        $network_type = $_POST['network_type'] ?? 'artist_library';
        $slot_number = $_POST['slot_number'] ?? null; 
        
        // รับค่าทั้ง EN และ TH
        $title = $_POST['title'] ?? '';
        $title_th = $_POST['title_th'] ?? '';
        $genre = $_POST['genre'] ?? '';
        $genre_th = $_POST['genre_th'] ?? '';
        $details = $_POST['details'] ?? '';
        $details_th = $_POST['details_th'] ?? '';
        
        $facebook = $_POST['facebook'] ?? '';
        $whatsapp = $_POST['whatsapp'] ?? '';
        $instagram = $_POST['instagram'] ?? '';
        $website = $_POST['website'] ?? '';
        $tiktok = $_POST['tiktok'] ?? '';
        $email = $_POST['email'] ?? '';
        $video_links = isset($_POST['video_links']) ? json_encode($_POST['video_links']) : '[]';

        $upload_dir = 'uploads/musicians/';
        if (!file_exists($upload_dir)) mkdir($upload_dir, 0777, true);

        $banner_path = null; $profile_path = null;

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
            if (!empty($musician_id)) {
                $sql = "UPDATE musicians SET network_type=?, slot_number=?, title=?, title_th=?, genre=?, genre_th=?, details=?, details_th=?, facebook=?, whatsapp=?, instagram=?, website=?, tiktok=?, email=?, video_link=?";
                $params = [$network_type, $slot_number, $title, $title_th, $genre, $genre_th, $details, $details_th, $facebook, $whatsapp, $instagram, $website, $tiktok, $email, $video_links];
                
                if ($banner_path) { $sql .= ", banner_image=?"; $params[] = $banner_path; }
                if ($profile_path) { $sql .= ", profile_image=?"; $params[] = $profile_path; }
                
                $sql .= " WHERE id=?"; $params[] = $musician_id;
                
                $stmt = $pdo->prepare($sql);
                $stmt->execute($params);
                echo json_encode(['status' => 'success', 'message' => 'อัปเดตข้อมูลศิลปิน สำเร็จ!']);
            } else {
                $stmt = $pdo->prepare("INSERT INTO musicians (network_type, slot_number, title, title_th, genre, genre_th, details, details_th, facebook, whatsapp, instagram, website, tiktok, email, video_link, banner_image, profile_image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                $stmt->execute([$network_type, $slot_number, $title, $title_th, $genre, $genre_th, $details, $details_th, $facebook, $whatsapp, $instagram, $website, $tiktok, $email, $video_links, $banner_path, $profile_path]);
                echo json_encode(['status' => 'success', 'message' => 'บันทึกข้อมูลศิลปินใหม่ สำเร็จ!']);
            }
        } catch (Exception $e) { echo json_encode(['status' => 'error', 'message' => 'เกิดข้อผิดพลาด: ' . $e->getMessage()]); }
        break;


    // ==========================================
    // 4. ระบบ CMBIGBAND
    // ==========================================
    case 'get_cmbigband':
        try {
            $stmt = $pdo->query("SELECT * FROM cmbigband ORDER BY id DESC LIMIT 1");
            $data = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($data) {
                echo json_encode(['status' => 'success', 'data' => $data]);
            } else {
                echo json_encode(['status' => 'success', 'data' => null]);
            }
        } catch (Exception $e) {
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
        break;

    case 'save_cmbigband':
        $title = $_POST['title'] ?? '';
        $title_th = $_POST['title_th'] ?? '';
        $genre = $_POST['genre'] ?? '';
        $genre_th = $_POST['genre_th'] ?? '';
        $facebook = $_POST['facebook'] ?? '';
        $whatsapp = $_POST['whatsapp'] ?? '';
        $instagram = $_POST['instagram'] ?? '';
        $website = $_POST['website'] ?? '';
        $tiktok = $_POST['tiktok'] ?? '';
        $email = $_POST['email'] ?? '';
        
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

        // --- จัดการ Page Builder แยก EN/TH ---
        $content_array_en = [];
        $content_array_th = [];
        $content_types = isset($_POST['content_types']) ? $_POST['content_types'] : [];
        $content_values = isset($_POST['content_values']) ? $_POST['content_values'] : [];
        $content_values_th = isset($_POST['content_values_th']) ? $_POST['content_values_th'] : [];
        $content_layouts = isset($_POST['content_layouts']) ? $_POST['content_layouts'] : [];

        for ($i = 0; $i < count($content_types); $i++) {
            $type = $content_types[$i];
            $value_en = $content_values[$i] ?? '';
            $value_th = $content_values_th[$i] ?? '';
            $layout = $content_layouts[$i] ?? 'col-1';

            if ($type === 'image') {
                $file_key = "content_images_" . $i;
                if (isset($_FILES[$file_key]) && $_FILES[$file_key]['error'] === UPLOAD_ERR_OK) {
                    $ext = pathinfo($_FILES[$file_key]['name'], PATHINFO_EXTENSION);
                    $filename = "cmb_content_" . time() . "_" . uniqid() . "." . $ext;
                    $target_file = $upload_dir . $filename;
                    if (move_uploaded_file($_FILES[$file_key]['tmp_name'], $target_file)) {
                        $value_en = $target_file; 
                        $value_th = $target_file; // รูปภาพใช้รูปเดียวกันทั้ง 2 ภาษา
                    }
                } else {
                    $value_th = $value_en; // กรณีไม่อัพรูปใหม่
                }
            } else if ($type === 'video') {
                $value_th = $value_en; // วิดีโอใช้ลิงก์เดียวกัน
            }
            
            $content_array_en[] = ['type' => $type, 'value' => $value_en, 'layout' => $layout];
            $content_array_th[] = ['type' => $type, 'value' => $value_th, 'layout' => $layout];
        }
        $details_json_en = json_encode($content_array_en, JSON_UNESCAPED_UNICODE);
        $details_json_th = json_encode($content_array_th, JSON_UNESCAPED_UNICODE);

        try {
            $stmt = $pdo->query("SELECT id FROM cmbigband LIMIT 1");
            $existing = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($existing) {
                $id = $existing['id'];
                $sql = "UPDATE cmbigband SET title=?, title_th=?, genre=?, genre_th=?, details=?, details_th=?, facebook=?, whatsapp=?, instagram=?, website=?, tiktok=?, email=?";
                $params = [$title, $title_th, $genre, $genre_th, $details_json_en, $details_json_th, $facebook, $whatsapp, $instagram, $website, $tiktok, $email];
                
                if ($banner_path) { $sql .= ", banner_image=?"; $params[] = $banner_path; }
                if ($profile_path) { $sql .= ", profile_image=?"; $params[] = $profile_path; }
                $sql .= " WHERE id=?"; $params[] = $id;
                
                $pdo->prepare($sql)->execute($params);
            } else {
                $stmt = $pdo->prepare("INSERT INTO cmbigband (title, title_th, genre, genre_th, details, details_th, facebook, whatsapp, instagram, website, tiktok, email, banner_image, profile_image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                $stmt->execute([$title, $title_th, $genre, $genre_th, $details_json_en, $details_json_th, $facebook, $whatsapp, $instagram, $website, $tiktok, $email, $banner_path, $profile_path]);
            }
            
            echo json_encode(['status' => 'success', 'message' => 'บันทึกข้อมูล CMBigband สำเร็จ!']);
        } catch (Exception $e) {
            echo json_encode(['status' => 'error', 'message' => 'เกิดข้อผิดพลาด: ' . $e->getMessage()]);
        }
        break;

    // ==========================================
    // 5. ระบบ COURSES LIBRARY
    // ==========================================
    case 'get_all_courses':
        try {
            $stmt = $pdo->query("SELECT * FROM courses ORDER BY slot_number ASC, id DESC");
            $courses = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode(['status' => 'success', 'data' => $courses]);
        } catch (Exception $e) {
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
        break;

    case 'get_course_details':
        $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
        try {
            $stmt = $pdo->prepare("SELECT * FROM courses WHERE id = ?");
            $stmt->execute([$id]);
            $data = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($data) {
                echo json_encode(['status' => 'success', 'data' => $data]);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'ไม่พบข้อมูลคอร์สเรียน']);
            }
        } catch (Exception $e) {
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
        break;

    case 'delete_course':
        $id = isset($_POST['course_id']) ? intval($_POST['course_id']) : 0;
        try {
            $stmt = $pdo->prepare("DELETE FROM courses WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(['status' => 'success', 'message' => 'ลบข้อมูลคอร์สเรียนสำเร็จ!']);
        } catch (Exception $e) {
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
        break;

    case 'save_course':
        $course_id = isset($_POST['course_id']) ? intval($_POST['course_id']) : 0;
        $slot_number = isset($_POST['slot_number']) ? intval($_POST['slot_number']) : 0;
        $title = $_POST['title'] ?? '';
        $title_th = $_POST['title_th'] ?? '';
        $creator = $_POST['creator'] ?? '';
        $creator_th = $_POST['creator_th'] ?? '';
        
        // --- 1. จัดการรูป Banner ---
        $banner_path = null;
        if (isset($_FILES['banner_image']) && $_FILES['banner_image']['error'] === UPLOAD_ERR_OK) {
            $ext = pathinfo($_FILES['banner_image']['name'], PATHINFO_EXTENSION);
            $filename = "course_banner_" . time() . "_" . uniqid() . "." . $ext;
            if (!is_dir("uploads/courses")) mkdir("uploads/courses", 0777, true);
            $target_file = "uploads/courses/" . $filename;
            if (move_uploaded_file($_FILES['banner_image']['tmp_name'], $target_file)) {
                $banner_path = $target_file;
            }
        }

        // --- 2. จัดการ Content แบบ 2 ภาษา ---
        $content_array_en = [];
        $content_array_th = [];
        $content_types = isset($_POST['content_types']) ? $_POST['content_types'] : [];
        $content_values = isset($_POST['content_values']) ? $_POST['content_values'] : [];
        $content_values_th = isset($_POST['content_values_th']) ? $_POST['content_values_th'] : [];
        $content_layouts = isset($_POST['content_layouts']) ? $_POST['content_layouts'] : []; 

        for ($i = 0; $i < count($content_types); $i++) {
            $type = $content_types[$i];
            $value_en = $content_values[$i] ?? '';
            $value_th = $content_values_th[$i] ?? '';
            $layout = $content_layouts[$i] ?? 'col-1'; 

            if ($type === 'image') {
                $file_key = "content_images_" . $i;
                if (isset($_FILES[$file_key]) && $_FILES[$file_key]['error'] === UPLOAD_ERR_OK) {
                    $ext = pathinfo($_FILES[$file_key]['name'], PATHINFO_EXTENSION);
                    $filename = "course_content_" . time() . "_" . uniqid() . "." . $ext;
                    if (!is_dir("uploads/courses")) mkdir("uploads/courses", 0777, true);
                    $target_file = "uploads/courses/" . $filename;
                    if (move_uploaded_file($_FILES[$file_key]['tmp_name'], $target_file)) {
                        $value_en = $target_file; 
                        $value_th = $target_file;
                    }
                } else {
                    $value_th = $value_en;
                }
            } else if ($type === 'video') {
                $value_th = $value_en;
            }
            
            $content_array_en[] = ['type' => $type, 'value' => $value_en, 'layout' => $layout];
            $content_array_th[] = ['type' => $type, 'value' => $value_th, 'layout' => $layout];
        }
        $details_json_en = json_encode($content_array_en, JSON_UNESCAPED_UNICODE);
        $details_json_th = json_encode($content_array_th, JSON_UNESCAPED_UNICODE);

        // --- 3. บันทึกลงฐานข้อมูล ---
        try {
            if ($course_id > 0) {
                $sql = "UPDATE courses SET slot_number=?, title=?, title_th=?, creator=?, creator_th=?, details=?, details_th=?";
                $params = [$slot_number, $title, $title_th, $creator, $creator_th, $details_json_en, $details_json_th];
                
                if ($banner_path !== null) { 
                    $sql .= ", banner_image=?"; 
                    $params[] = $banner_path; 
                }
                $sql .= " WHERE id=?"; 
                $params[] = $course_id;
                
                $stmt = $pdo->prepare($sql);
                $stmt->execute($params);
            } else {
                $stmt = $pdo->prepare("INSERT INTO courses (slot_number, title, title_th, creator, creator_th, details, details_th, banner_image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
                $stmt->execute([$slot_number, $title, $title_th, $creator, $creator_th, $details_json_en, $details_json_th, $banner_path]);
            }
            echo json_encode(['status' => 'success', 'message' => 'บันทึกข้อมูลคอร์สเรียนสำเร็จ!']);
        } catch (Exception $e) {
            echo json_encode(['status' => 'error', 'message' => 'DB Error: ' . $e->getMessage()]);
        }
        break;

    case 'update_course_order':
        $order_data = isset($_POST['order_data']) ? json_decode($_POST['order_data'], true) : [];
        if (is_array($order_data)) {
            try {
                $pdo->beginTransaction();
                $stmt = $pdo->prepare("UPDATE courses SET slot_number = ? WHERE id = ?");
                foreach ($order_data as $item) {
                    $stmt->execute([ intval($item['slot_number']), intval($item['id']) ]);
                }
                $pdo->commit();
                echo json_encode(['status' => 'success', 'message' => 'Order updated']);
            } catch (Exception $e) {
                $pdo->rollBack();
                echo json_encode(['status' => 'error', 'message' => 'Failed to update order']);
            }
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Invalid data']);
        }
        break;

    default:
        echo json_encode(['status' => 'error', 'message' => 'Invalid action']);
}
?>