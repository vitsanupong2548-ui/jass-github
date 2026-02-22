<?php
include 'db.php';

if (isset($_GET['table']) && isset($_GET['id'])) {
    $table = $_GET['table'];
    $id = $_GET['id'];
    
    // หาชื่อคอลัมน์ที่เป็น Primary Key
    $pk_query = $conn->query("SHOW KEYS FROM `$table` WHERE Key_name = 'PRIMARY'");
    $pk_row = $pk_query->fetch_assoc();
    $pk_col = $pk_row['Column_name'];
    
    // สร้างคำสั่ง SQL สำหรับลบข้อมูล
    $sql = "DELETE FROM `$table` WHERE `$pk_col` = ?";
    $stmt = $conn->prepare($sql);
    
    if ($stmt) {
        $stmt->bind_param("s", $id);
        $stmt->execute();
    }
    
    // เด้งกลับไปหน้า Dataadmin
    header("Location: Dataadmin.php?table=$table");
    exit;
}
?>