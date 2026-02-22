<?php
include 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $table = $_POST['table']; // รับชื่อตาราง
    unset($_POST['table']);   // เอาชื่อตารางออกจากข้อมูลที่จะบันทึก
    
    $columns = [];
    $values = [];
    $placeholders = [];
    $types = "";
    
    foreach ($_POST as $key => $val) {
        $columns[] = "`$key`";
        $values[] = $val;
        $placeholders[] = "?";
        $types .= "s"; // กำหนดประเภทตัวแปรเป็น string
    }
    
    // สร้างคำสั่ง SQL สำหรับเพิ่มข้อมูล
    $sql = "INSERT INTO `$table` (" . implode(', ', $columns) . ") VALUES (" . implode(', ', $placeholders) . ")";
    $stmt = $conn->prepare($sql);
    
    if ($stmt) {
        $stmt->bind_param($types, ...$values);
        $stmt->execute();
    }
    
    // ทำเสร็จแล้วเด้งกลับไปหน้า Dataadmin
    header("Location: Dataadmin.php?table=$table");
    exit;
}
?>