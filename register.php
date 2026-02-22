<?php
header('Content-Type: application/json');
include 'db.php'; // เชื่อมต่อฐานข้อมูล

// รับข้อมูล JSON จากหน้าเว็บ
$data = json_decode(file_get_contents("php://input"));

if(isset($data->username) && isset($data->email) && isset($data->password)) {
    $username = $data->username;
    $email = $data->email;
    // เข้ารหัสผ่านเพื่อความปลอดภัย
    $password_hashed = password_hash($data->password, PASSWORD_DEFAULT); 
    $created_at = date('Y-m-d H:i:s');
    $role = 'user'; // ตั้งค่าเริ่มต้นให้เป็น user

    // เช็คว่ามีอีเมลนี้ในระบบหรือยัง
    $check_stmt = $conn->prepare("SELECT email FROM users WHERE email = ?");
    $check_stmt->bind_param("s", $email);
    $check_stmt->execute();
    $check_result = $check_stmt->get_result();

    if($check_result->num_rows > 0) {
        http_response_code(400);
        echo json_encode(["message" => "Email already exists!"]); // เปลี่ยนเป็น EN
        exit();
    }

    // บันทึกข้อมูลลงตาราง users
    $stmt = $conn->prepare("INSERT INTO users (username, email, password, created_at, role) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("sssss", $username, $email, $password_hashed, $created_at, $role);
    
    if($stmt->execute()) {
        http_response_code(200);
        echo json_encode(["message" => "Registration Successful"]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Error saving to database."]); // เปลี่ยนเป็น EN
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Please fill in all required fields."]); // เปลี่ยนเป็น EN
}
?>