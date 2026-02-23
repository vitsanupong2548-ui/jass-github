# Host: localhost  (Version 5.5.5-10.4.32-MariaDB)
# Date: 2026-02-23 23:57:58
# Generator: MySQL-Front 6.0  (Build 2.20)


#
# Structure for table "cmbigband"
#

DROP TABLE IF EXISTS `cmbigband`;
CREATE TABLE `cmbigband` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `genre` varchar(100) DEFAULT NULL,
  `details` text DEFAULT NULL,
  `facebook` varchar(255) DEFAULT NULL,
  `whatsapp` varchar(255) DEFAULT NULL,
  `instagram` varchar(255) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `tiktok` varchar(255) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `video_link` text DEFAULT NULL,
  `banner_image` varchar(255) DEFAULT NULL,
  `profile_image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

#
# Data for table "cmbigband"
#

INSERT INTO `cmbigband` VALUES (1,'พดเกดเ','กดเกดเ','้่เ้่เ้่เ้่','เกดเกดเ','เกดเดก','เกเกดเ','เกดเดก','กเกดเกด','เกดเ','[\"https:\\/\\/www.youtube.com\\/watch?v=h1tbhH8RBBU&list=RDh1tbhH8RBBU&start_radio=1\"]','uploads/cmbigband/banner_1771865585_699c85f154575.png','uploads/cmbigband/profile_1771865585_699c85f154727.png','2026-02-23 23:53:05');

#
# Structure for table "courses"
#

DROP TABLE IF EXISTS `courses`;
CREATE TABLE `courses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `creator` varchar(100) DEFAULT NULL,
  `details` text DEFAULT NULL,
  `banner_image` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

#
# Data for table "courses"
#

INSERT INTO `courses` VALUES (1,'fdgfdg','dfgdfg','[{\"type\":\"text\",\"value\":\"dfghgfjgl;\"},{\"type\":\"text\",\"value\":\"hjkhjkjhkhj\"},{\"type\":\"image\",\"value\":\"uploads\\/courses\\/course_content_1771864745_699c82a92b5f2.png\"},{\"type\":\"video\",\"value\":\"https:\\/\\/www.youtube.com\\/watch?v=h1tbhH8RBBU&list=RDh1tbhH8RBBU&start_radio=1\"}]','uploads/courses/course_banner_1771864745_699c82a92b457.png');

#
# Structure for table "events"
#

DROP TABLE IF EXISTS `events`;
CREATE TABLE `events` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `short_description` text DEFAULT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `details` text DEFAULT NULL,
  `banner_image` varchar(255) DEFAULT NULL,
  `poster_image` varchar(255) DEFAULT NULL,
  `venue_image` varchar(255) DEFAULT NULL,
  `gallery_images` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

#
# Data for table "events"
#

INSERT INTO `events` VALUES (1,'','','0000-00-00 00:00:00','0000-00-00 00:00:00','','',NULL,NULL,NULL,'[]','2026-02-23 21:26:51'),(2,'','','0000-00-00 00:00:00','0000-00-00 00:00:00','','',NULL,NULL,NULL,'[]','2026-02-23 21:36:40'),(3,'','','0000-00-00 00:00:00','0000-00-00 00:00:00','','',NULL,NULL,NULL,'[]','2026-02-23 21:38:35'),(4,'','','2026-02-23 15:46:37','2026-02-23 15:46:37','','',NULL,NULL,NULL,'[]','2026-02-23 21:46:37'),(5,'','','2026-02-23 15:59:01','2026-02-23 15:59:01','','',NULL,NULL,NULL,'[]','2026-02-23 21:59:01'),(6,'','','2026-02-23 16:34:02','2026-02-23 16:34:02','','',NULL,NULL,'uploads/events/venue_1771860842_699c736aa08ca.png','[\"uploads\\/events\\/gallery_1771860842_699c736aa13de_0.png\",\"uploads\\/events\\/gallery_1771860842_699c736aa14dd_1.png\"]','2026-02-23 22:34:02'),(7,'เกะัถะั ทภา','ุะพถุัำถพุ','2026-02-24 12:00:00','2026-02-24 15:00:00','ดเดกะ','กหพะเำถ','uploads/events/banner_1771863277_699c7ceddaa36.png','uploads/events/poster_1771863277_699c7ceddab29.png','uploads/events/venue_1771863277_699c7ceddabd0.png','[\"uploads\\/events\\/gallery_1771863277_699c7ceddac71_0.png\",\"uploads\\/events\\/gallery_1771863277_699c7ceddad14_1.png\",\"uploads\\/events\\/gallery_1771863277_699c7ceddadb4_2.png\"]','2026-02-23 23:14:37');

#
# Structure for table "event_tickets"
#

DROP TABLE IF EXISTS `event_tickets`;
CREATE TABLE `event_tickets` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `event_id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `details` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `amount` int(11) NOT NULL,
  `is_open` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `event_id` (`event_id`),
  CONSTRAINT `event_tickets_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

#
# Data for table "event_tickets"
#

INSERT INTO `event_tickets` VALUES (1,6,'hgjhgj','ghjhgj',555.00,5,1),(2,6,'edtdfg','5tdrt',777.00,6,1),(3,7,'เดท่','กพะัำเ',999.00,99,1),(4,7,'fghj','dfgbdf',888.00,88,1);

#
# Structure for table "event_lineups"
#

DROP TABLE IF EXISTS `event_lineups`;
CREATE TABLE `event_lineups` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `event_id` int(11) NOT NULL,
  `lineup_date` date DEFAULT NULL,
  `lineup_time` time DEFAULT NULL,
  `band_name` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `event_id` (`event_id`),
  CONSTRAINT `event_lineups_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

#
# Data for table "event_lineups"
#

INSERT INTO `event_lineups` VALUES (1,4,'2026-02-23','21:46:00','hjk','2026-02-23 21:46:37'),(2,4,NULL,'22:46:00','jfsasf','2026-02-23 21:46:37'),(3,5,NULL,'21:58:00','กดกดก','2026-02-23 21:59:01'),(4,5,NULL,'22:58:00','กดกดก','2026-02-23 21:59:01'),(5,6,'2026-02-23','22:33:00','hgjhj','2026-02-23 22:34:02'),(6,6,'2026-02-23','23:33:00','hghg','2026-02-23 22:34:02'),(7,7,'2026-02-24','23:14:00','htfyhfh','2026-02-23 23:14:37'),(8,7,NULL,'00:14:00','fthtuytu','2026-02-23 23:14:37');

#
# Structure for table "musicians"
#

DROP TABLE IF EXISTS `musicians`;
CREATE TABLE `musicians` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `network_type` enum('artist_library','jazz_network') DEFAULT 'artist_library',
  `title` varchar(255) NOT NULL,
  `genre` varchar(100) DEFAULT NULL,
  `details` text DEFAULT NULL,
  `facebook` varchar(255) DEFAULT NULL,
  `whatsapp` varchar(255) DEFAULT NULL,
  `instagram` varchar(255) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `tiktok` varchar(255) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `video_link` varchar(255) DEFAULT NULL,
  `banner_image` varchar(255) DEFAULT NULL,
  `profile_image` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

#
# Data for table "musicians"
#

INSERT INTO `musicians` VALUES (1,'artist_library','gggg','dfgd','stkyukdr','gfhfg','fghgfhkj','fghfgh','fuyljil','fhf','fjghjgh','[\"https:\\/\\/www.youtube.com\\/watch?v=AnY9kgflPPk&list=RDAnY9kgflPPk&start_radio=1\",\"https:\\/\\/www.youtube.com\\/watch?v=h1tbhH8RBBU&list=RDh1tbhH8RBBU&start_radio=1\"]','uploads/musicians/banner_1771863042_699c7c020041d.png','uploads/musicians/profile_1771863042_699c7c020050e.png'),(2,'artist_library','dfggfhgkj','hjkjkljkh','wreewr','kjljklk','weretret','ljkljkljk','wewrwer','ljkljk\'\'','rwrwer','[]','uploads/musicians/banner_1771863430_699c7d86a4e53.png','uploads/musicians/profile_1771863430_699c7d86a4f2f.png'),(3,'jazz_network','uyujykjh','jkl;werwq','rwer','eqwqweq','rwerwer','eqew','werwerwe','rqwewrw','rwrwerwe','[]','uploads/musicians/banner_1771863459_699c7da39cdf3.png','uploads/musicians/profile_1771863459_699c7da39d713.png');

#
# Structure for table "users"
#

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `role` enum('admin','user') DEFAULT 'user',
  `status` enum('pending','approved','suspended') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

#
# Data for table "users"
#

INSERT INTO `users` VALUES (1,'admin','$2y$10$geLkDiiWk1MkF1xpJBEzaOV.Gr.2m.D7RhVHUTTr/W0qSPJX1miDu','admin@local.com','admin','approved','2026-02-23 21:24:43'),(2,'bhassa','$2y$10$uBKOi/KmYUPpT/Y0n/NTkePtcLpG.TMKqu7w1fjbDV7erNljh84eS','bhassakorn.ps@gmail.com','admin','approved','2026-02-23 21:25:12'),(3,'admin@jazz01','$2y$10$x9PFgK5/grvqlLil.qYHO.sCv.iTCOTcDjchxgstHPjMoA1hQMMui','admin@jazz.com','admin','approved','2026-02-23 23:33:50');
