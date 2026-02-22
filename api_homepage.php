<?php
header('Content-Type: application/json');
include 'db.php'; 

$result = $conn->query("SELECT setting_key, setting_value FROM homepage_content");
$data = [];

if ($result && $result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $data[$row['setting_key']] = $row['setting_value'];
    }
}

echo json_encode($data);
?>