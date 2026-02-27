-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Feb 26, 2026 at 05:41 PM
-- Server version: 8.4.5-5
-- PHP Version: 8.2.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `dbytnc8xerk87n`
--

-- --------------------------------------------------------

--
-- Table structure for table `cmbigband`
--

CREATE TABLE `cmbigband` (
  `id` int NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `genre` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `details` text COLLATE utf8mb4_unicode_ci,
  `facebook` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `whatsapp` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `instagram` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `website` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tiktok` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `video_link` text COLLATE utf8mb4_unicode_ci,
  `banner_image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `profile_image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cmbigband`
--

INSERT INTO `cmbigband` (`id`, `title`, `genre`, `details`, `facebook`, `whatsapp`, `instagram`, `website`, `tiktok`, `email`, `video_link`, `banner_image`, `profile_image`, `created_at`) VALUES
(2, 'UUIUIUI', 'UUUUUUUUUUUUUUUUUUUUUUUUUUUUUU', '[{\"type\":\"text\",\"value\":\"asdfasfasfasdfas\",\"layout\":\"col-1\"},{\"type\":\"image\",\"value\":\"uploads\\/cmbigband\\/cmb_content_1772012184_699ec298c8fc3.jpg\",\"layout\":\"col-2\"},{\"type\":\"image\",\"value\":\"uploads\\/cmbigband\\/cmb_content_1772012184_699ec298c929b.jpg\",\"layout\":\"col-2\"}]', 'https://gemini.google.com/u/0/app/203d0c93751c19a8?pageId=none', '09467355959', 'https://gemini.google.com/u/0/app/203d0c93751c19a8?pageId=none', 'https://gemini.google.com/u/0/app/203d0c93751c19a8?pageId=none', 'https://gemini.google.com/u/0/app/203d0c93751c19a8?pageId=none', 'https://gemini.google.com/u/0/app/203d0c93751c19a8?pageId=none', NULL, 'uploads/cmbigband/banner_1772012184_699ec298c86a8.jpg', 'uploads/cmbigband/profile_1772012184_699ec298c8b34.jpg', '2026-02-25 09:36:24');

-- --------------------------------------------------------

--
-- Table structure for table `courses`
--

CREATE TABLE `courses` (
  `id` int NOT NULL,
  `slot_number` int DEFAULT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `creator` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `details` text COLLATE utf8mb4_unicode_ci,
  `banner_image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `courses`
--

INSERT INTO `courses` (`id`, `slot_number`, `title`, `creator`, `details`, `banner_image`) VALUES
(1, 3, 'fdgfdg', 'dfgdfg', '[{\"type\":\"text\",\"value\":\"dfghgfjgl;\",\"layout\":\"col-1\"},{\"type\":\"text\",\"value\":\"hjkhjkjhkhj\",\"layout\":\"col-2\"},{\"type\":\"image\",\"value\":\"uploads\\/courses\\/content_1771958454_699df0b66d33a.jpg\",\"layout\":\"col-2\"},{\"type\":\"video\",\"value\":\"https:\\/\\/www.youtube.com\\/watch?v=h1tbhH8RBBU&list=RDh1tbhH8RBBU&start_radio=1\",\"layout\":\"col-1\"}]', 'uploads/courses/banner_1771958454_699df0b66c8cc.jpg'),
(2, 1, 'ฟหกด', 'ฟหกด', '[{\"type\":\"text\",\"value\":\"ฟหกดหก\",\"layout\":\"col-1\"},{\"type\":\"image\",\"value\":\"uploads\\/courses\\/course_content_1772008106_699eb2aae680b.jpg\",\"layout\":\"col-1\"}]', 'uploads/courses/course_banner_1771961875_699dfe139097c.jpg'),
(3, 2, 'asdf', 'adsf', '[{\"type\":\"text\",\"value\":\"asdf\"}]', 'uploads/courses/course_banner_1771961912_699dfe38e15a4.jpg'),
(4, 4, 'ฟกหดฟหกด', 'ฟหกดฟหกด', '[{\"type\":\"text\",\"value\":\"ฟหกดฟหกด\"}]', 'uploads/courses/course_banner_1772004380_699ea41c56a30.jpg'),
(5, 5, 'ฟกหด', 'ฟหกด', '[{\"type\":\"text\",\"value\":\"ฟหกดฟ\"}]', 'uploads/courses/course_banner_1772004418_699ea442eb4bf.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `id` int NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `short_description` text COLLATE utf8mb4_unicode_ci,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `location` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `details` text COLLATE utf8mb4_unicode_ci,
  `banner_image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `poster_image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `venue_image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `venue_title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `venue_details` text COLLATE utf8mb4_unicode_ci,
  `venue_map` text COLLATE utf8mb4_unicode_ci,
  `gallery_images` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`id`, `title`, `short_description`, `start_date`, `end_date`, `location`, `details`, `banner_image`, `poster_image`, `venue_image`, `venue_title`, `venue_details`, `venue_map`, `gallery_images`, `created_at`) VALUES
(13, 'fffffffffffffffffffffffffffffffff', 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff', '2026-02-24 02:28:00', '2026-02-24 02:31:00', '', 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff', 'uploads/events/banner_1771875020_699caaccc49c3.png', 'uploads/events/poster_1771875020_699caaccc4e48.webp', 'uploads/events/venue_1771875020_699caaccc5288.png', '', '', '', '[\"uploads\\/events\\/gallery_1771875020_699caaccc5871_0.webp\"]', '2026-02-23 19:30:20'),
(14, 'ttttttttttttttttttttttttttttttttttttttttttttt', 'ttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt', '2026-02-24 12:00:00', '2026-02-24 15:00:00', '', 'ttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt', 'uploads/events/banner_1771909459_699d3153718ad.png', 'uploads/events/poster_1771909459_699d315371cb8.jpg', 'uploads/events/venue_1771932173_699d8a0de460a.jpg', 'Hello', 'HAHAHAHAHAHA', '<iframe src=\"https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d60433.40760753234!2d98.9152775!3d18.7942323!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30da3b9c93d76acf%3A0xb9a78f294af5fc20!2sSipSpot!5e0!3m2!1sth!2sth!4v1771943670840!5m2!1sth!2sth\" width=\"600\" height=\"450\" style=\"border:0;\" allowfullscreen=\"\" loading=\"lazy\" referrerpolicy=\"no-referrer-when-downgrade\"></iframe>', '[\"uploads\\/events\\/gallery_1771930442_699d834acdda6_0.webp\",\"uploads\\/events\\/gallery_1771930442_699d834ace125_1.webp\"]', '2026-02-24 05:04:19'),
(16, 'adsffffffffffffffff', 'asdfffffffff', '2026-02-24 13:47:00', '2026-02-24 13:48:00', '', 'asdffffffff', 'uploads/events/banner_1771928131_699d7a43611b3.jpg', 'uploads/events/poster_1771915685_699d49a5e726e.JPG', NULL, NULL, NULL, NULL, '[]', '2026-02-24 06:48:05'),
(20, '', '', '2026-02-24 21:46:33', '2026-02-24 21:46:33', '', '', NULL, NULL, NULL, '', '', '', '[]', '2026-02-24 20:46:33');

-- --------------------------------------------------------

--
-- Table structure for table `event_lineups`
--

CREATE TABLE `event_lineups` (
  `id` int NOT NULL,
  `event_id` int NOT NULL,
  `lineup_date` date DEFAULT NULL,
  `lineup_time` time DEFAULT NULL,
  `lineup_stage` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `band_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `event_lineups`
--

INSERT INTO `event_lineups` (`id`, `event_id`, `lineup_date`, `lineup_time`, `lineup_stage`, `band_name`, `created_at`) VALUES
(47, 13, '2026-02-24', '02:32:00', '', 'F', '2026-02-24 20:34:30'),
(48, 14, '2026-02-24', NULL, 'IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII', 'iq1123', '2026-02-24 20:44:23'),
(49, 14, '2026-02-24', NULL, 'IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII', 'iq11232', '2026-02-24 20:44:23');

-- --------------------------------------------------------

--
-- Table structure for table `event_tickets`
--

CREATE TABLE `event_tickets` (
  `id` int NOT NULL,
  `event_id` int NOT NULL,
  `title` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `details` text COLLATE utf8mb4_unicode_ci,
  `price` decimal(10,2) NOT NULL,
  `amount` int NOT NULL,
  `is_open` tinyint(1) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `event_tickets`
--

INSERT INTO `event_tickets` (`id`, `event_id`, `title`, `details`, `price`, `amount`, `is_open`) VALUES
(82, 13, 'ffffffffffffffffffffffffffffffffffffffffff', 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff', 30000.00, 800, 1),
(83, 14, 'ttttttttttttttttttttttttt', 'ttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt', 6000.00, 6000, 1),
(84, 14, 'ttttttttttttttttttttttttt1', 'ttttttttttttttttttttttttt1', 80000.00, 6000, 1),
(85, 14, 'ttttttttttttttttttttttttt2', 'ttttttttttttttttttttttttt2', 8000.00, 800, 1),
(86, 14, 'klkdsfsdfds', 'sdfafssssssssssssssssssssssssss', 800.00, 300, 1);

-- --------------------------------------------------------

--
-- Table structure for table `musicians`
--

CREATE TABLE `musicians` (
  `id` int NOT NULL,
  `slot_number` int DEFAULT NULL,
  `network_type` enum('artist_library','jazz_network') COLLATE utf8mb4_unicode_ci DEFAULT 'artist_library',
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `genre` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `details` text COLLATE utf8mb4_unicode_ci,
  `facebook` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `whatsapp` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `instagram` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `website` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tiktok` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `video_link` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `banner_image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `profile_image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `musicians`
--

INSERT INTO `musicians` (`id`, `slot_number`, `network_type`, `title`, `genre`, `details`, `facebook`, `whatsapp`, `instagram`, `website`, `tiktok`, `email`, `video_link`, `banner_image`, `profile_image`) VALUES
(4, 1, 'artist_library', 'HELLO', 'MOOO', 'kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk', 'https://www.facebook.com/', '096454542', '', '', '', '', '[\"https:\\/\\/www.youtube.com\\/watch?v=xeLtkYELNwI\"]', 'uploads/musicians/banner_1771950548_699dd1d4dcc15.webp', 'uploads/musicians/profile_1771951567_699dd5cf50996.jpg'),
(5, 2, 'artist_library', 'TEST2.', 'BOOK NOW', 'alksjdljf;alsdj;lfasjd;lfjslkjfmijlkjoijnoijoihjkjlsiemdnlskdur', 'https://www.facebook.com/', '', 'https://www.facebook.com/', 'https://www.facebook.com/', 'https://www.facebook.com/', 'https://www.facebook.com/', '[\"https:\\/\\/www.youtube.com\\/watch?v=zyZ6YWfZN2I\",\"https:\\/\\/www.youtube.com\\/watch?v=zyZ6YWfZN2I\"]', 'uploads/musicians/banner_1771950067_699dcff30496a.webp', 'uploads/musicians/profile_1771951589_699dd5e5d54ea.jpg'),
(6, 1, 'jazz_network', 'ดดดดดดดดดดดดดดดดดดด', 'ะะะะะะะะะะะะะะะะะะะะะะะะะะะะะะะะะะะะะะะะะะะะะะะะะะะะะะะะะะะะะะะะะะะะะะะะะะะะะะะะะะะะะะะะะะะะะะะะะะะะ', 'ดดดดดดดดดดดดดดดดดดดดดดดดดดดดดดดดด', 'https://www.facebook.com/', '0987463245', 'https://www.facebook.com/', 'https://www.facebook.com/', 'https://www.facebook.com/', 'https://www.facebook.com/', '[\"https:\\/\\/www.youtube.com\\/watch?v=zyZ6YWfZN2I\"]', 'uploads/musicians/banner_1771948761_699dcad9e5c92.jpg', 'uploads/musicians/profile_1771948761_699dcad9e5ebc.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('admin','user') COLLATE utf8mb4_unicode_ci DEFAULT 'user',
  `status` enum('pending','approved','suspended') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `email`, `role`, `status`, `created_at`) VALUES
(1, 'admin', '$2y$10$geLkDiiWk1MkF1xpJBEzaOV.Gr.2m.D7RhVHUTTr/W0qSPJX1miDu', 'admin@local.com', 'admin', 'approved', '2026-02-23 14:24:43'),
(2, 'bhassa', '$2y$10$uBKOi/KmYUPpT/Y0n/NTkePtcLpG.TMKqu7w1fjbDV7erNljh84eS', 'bhassakorn.ps@gmail.com', 'admin', 'approved', '2026-02-23 14:25:12'),
(3, 'admin@jazz01', '$2y$10$x9PFgK5/grvqlLil.qYHO.sCv.iTCOTcDjchxgstHPjMoA1hQMMui', 'admin@jazz.com', 'admin', 'approved', '2026-02-23 16:33:50'),
(4, 'test', '$2y$10$keaz/4F6636RzRBF6pmLIu4YNGVy3sPwQNEs.3yCD.dnFyWMIJEmK', 'test@gmail.com', 'user', 'pending', '2026-02-23 18:08:45'),
(5, 'maji', '$2y$10$dK/vEh4mkIZmU0JSHZdARegp2XEtO.T7s397lfFAVaL80RA4HJ8Dq', 'maji@gmail.com', 'user', 'approved', '2026-02-25 10:51:04');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cmbigband`
--
ALTER TABLE `cmbigband`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `event_lineups`
--
ALTER TABLE `event_lineups`
  ADD PRIMARY KEY (`id`),
  ADD KEY `event_id` (`event_id`);

--
-- Indexes for table `event_tickets`
--
ALTER TABLE `event_tickets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `event_id` (`event_id`);

--
-- Indexes for table `musicians`
--
ALTER TABLE `musicians`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cmbigband`
--
ALTER TABLE `cmbigband`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `courses`
--
ALTER TABLE `courses`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `event_lineups`
--
ALTER TABLE `event_lineups`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

--
-- AUTO_INCREMENT for table `event_tickets`
--
ALTER TABLE `event_tickets`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=87;

--
-- AUTO_INCREMENT for table `musicians`
--
ALTER TABLE `musicians`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `event_lineups`
--
ALTER TABLE `event_lineups`
  ADD CONSTRAINT `event_lineups_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `event_tickets`
--
ALTER TABLE `event_tickets`
  ADD CONSTRAINT `event_tickets_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
