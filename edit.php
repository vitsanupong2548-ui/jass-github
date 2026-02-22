<?php
include 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $table = $_POST['table'];
    $id = $_POST['id'];
    unset($_POST['table'], $_POST['id']);
    
    // หาชื่อคอลัมน์ที่เป็น Primary Key ของตารางนั้นๆ
    $pk_query = $conn->query("SHOW KEYS FROM `$table` WHERE Key_name = 'PRIMARY'");
    $pk_row = $pk_query->fetch_assoc();
    $pk_col = $pk_row['Column_name'];
    
    $updates = [];
    $values = [];
    $types = "";
    
    foreach ($_POST as $key => $val) {
        if ($key === $pk_col) continue; // ข้ามช่อง Primary Key ไป (ห้ามแก้ไอดี)
        $updates[] = "`$key` = ?";
        $values[] = $val;
        $types .= "s";
    }
    
    // ใส่ ID ไว้ท้ายสุดสำหรับเงื่อนไข WHERE
    $values[] = $id;
    $types .= "s";
    
    // สร้างคำสั่ง SQL สำหรับอัปเดต
    $sql = "UPDATE `$table` SET " . implode(', ', $updates) . " WHERE `$pk_col` = ?";
    $stmt = $conn->prepare($sql);
    
    if ($stmt) {
        $stmt->bind_param($types, ...$values);
        $stmt->execute();
    }
    
    // เด้งกลับไปหน้า Dataadmin
    header("Location: Dataadmin.php?table=$table");
    exit;
}
?>