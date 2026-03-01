# Host: localhost  (Version 5.5.5-10.4.32-MariaDB)
# Date: 2026-03-01 15:22:21
# Generator: MySQL-Front 6.0  (Build 2.20)


#
# Structure for table "ticket_orders"
#

DROP TABLE IF EXISTS `ticket_orders`;
CREATE TABLE `ticket_orders` (
  `order_id` int(11) NOT NULL AUTO_INCREMENT,
  `order_code` varchar(50) NOT NULL COMMENT 'รหัสออเดอร์ เช่น #T25364',
  `event_id` int(11) NOT NULL COMMENT 'อ้างอิงรหัสงานอีเวนต์ (ตาราง events)',
  `ticket_id` int(11) NOT NULL COMMENT 'อ้างอิงรหัสประเภทตั๋ว (ตาราง event_tickets)',
  `customer_name` varchar(150) NOT NULL COMMENT 'ชื่อ-นามสกุลลูกค้า',
  `address` text NOT NULL COMMENT 'ที่อยู่จัดส่งเอกสาร/ข้อมูล',
  `phone` varchar(20) NOT NULL COMMENT 'เบอร์โทรศัพท์',
  `email` varchar(100) DEFAULT NULL COMMENT 'อีเมลลูกค้า',
  `amount` int(11) NOT NULL DEFAULT 1 COMMENT 'จำนวนตั๋วที่ซื้อ',
  `total_price` decimal(10,2) NOT NULL COMMENT 'ราคารวมทั้งหมด ณ ตอนที่ซื้อ',
  `payment_status` varchar(255) NOT NULL DEFAULT '' COMMENT 'สถานะการชำระเงิน',
  `order_status` enum('pending','success','canceled') NOT NULL DEFAULT 'pending' COMMENT 'สถานะคำสั่งซื้อ',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'เวลาที่ทำรายการสั่งซื้อ',
  PRIMARY KEY (`order_id`),
  UNIQUE KEY `order_code` (`order_code`),
  KEY `event_id` (`event_id`),
  KEY `ticket_id` (`ticket_id`),
  CONSTRAINT `fk_ticket_orders_event` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ticket_orders_ticket` FOREIGN KEY (`ticket_id`) REFERENCES `event_tickets` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

#
# Data for table "ticket_orders"
#

INSERT INTO `ticket_orders` VALUES (1,'#T25364',6,1,'Suwaree Kalo','Chiangmai','+66235458','hu@lol.com',5,2775.00,'uploads/slips/slip_ticket_1_69a3f444a7e90.jpg','success','2026-03-01 14:01:19'),(2,'#T25365',6,2,'John Doe','Bangkok','+66899999','john@lol.com',2,1554.00,'pending','pending','2026-03-01 14:01:19'),(3,'#T25366',7,3,'Jane Smith','Phuket','+66877777','jane@lol.com',1,999.00,'pending','pending','2026-03-01 14:01:19');
