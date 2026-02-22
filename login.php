<?php
header('Content-Type: application/json');
include 'db.php';

$data = json_decode(file_get_contents("php://input"));

if(isset($data->email) && isset($data->password)) {
    $email = $data->email;
    $password = $data->password;

    // ค้นหาผู้ใช้จากอีเมล
    $stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        
        // ตรวจสอบรหัสผ่าน
        if(password_verify($password, $user['password'])) {
            // อัปเดตเวลาเข้าสู่ระบบล่าสุด (last_login)
            $update_login = $conn->prepare("UPDATE users SET last_login = NOW() WHERE user_id = ?");
            $update_login->bind_param("i", $user['user_id']);
            $update_login->execute();

            http_response_code(200);
            echo json_encode([
                "message" => "Login Successful",
                "token" => "user-logged-in-".$user['user_id'], // สร้าง token จำลอง
                "username" => $user['username'],
                "role" => $user['role']
            ]);
        } else {
            http_response_code(401);
            echo json_encode(["message" => "Incorrect password!"]); // เปลี่ยนเป็น EN
        }
    } else {
        http_response_code(404);
        echo json_encode(["message" => "Email not found!"]); // เปลี่ยนเป็น EN
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Please enter both email and password."]); // เปลี่ยนเป็น EN
}
?>