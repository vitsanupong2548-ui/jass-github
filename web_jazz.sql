-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 21, 2026 at 01:18 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `web_jazz`
--

-- --------------------------------------------------------

--
-- Table structure for table `analytics`
--

CREATE TABLE `analytics` (
  `analyticsid` int(11) NOT NULL,
  `userid` int(11) DEFAULT NULL,
  `pageviewed` longtext DEFAULT NULL,
  `visittimestamp` datetime DEFAULT current_timestamp(),
  `sessionid` longtext DEFAULT NULL,
  `devicetype` longtext DEFAULT NULL,
  `browser` longtext DEFAULT NULL,
  `durationsec` int(11) DEFAULT NULL,
  `referrer` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `analytics`
--

INSERT INTO `analytics` (`analyticsid`, `userid`, `pageviewed`, `visittimestamp`, `sessionid`, `devicetype`, `browser`, `durationsec`, `referrer`) VALUES
(1, 15, '/audio/1', '2025-05-20 14:30:00', 'sess-abc123', 'Mobile', 'Chrome', 180, '/home');

-- --------------------------------------------------------

--
-- Table structure for table `articles`
--

CREATE TABLE `articles` (
  `article_id` int(11) NOT NULL,
  `title` varchar(200) DEFAULT NULL,
  `cover_image` varchar(255) DEFAULT NULL,
  `content` longtext DEFAULT NULL,
  `community_name` varchar(100) DEFAULT NULL,
  `interviewee` varchar(100) DEFAULT NULL,
  `video_url` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `articles`
--

INSERT INTO `articles` (`article_id`, `title`, `cover_image`, `content`, `community_name`, `interviewee`, `video_url`, `created_at`) VALUES
(1, 'ประวัติซอสามสาย', 'http://example.com/cover1.jpg', 'ซอสามสายเป็นเครื่องดนตรีที่มีประวัติยาวนาน...', 'ชุมชนแม่แจ่ม', 'นายสมหญิง', 'http://youtube.com/xxx', '2025-05-20 14:13:28'),
(2, '', '', '', '', '', '', '2025-05-20 14:13:28'),
(3, '', '', '', '', '', '', '2025-05-21 00:00:00'),
(5, 'ใครหน้ารักทีสุด', NULL, 'ใครหน้ารักทีสุด', 'รักเด็ก', 'bbbb1', NULL, '2025-08-29 03:06:15'),
(6, 'นั้นแย่มากๆ', NULL, 'นั้นแย่มากๆ', 'program', 'bbbb1', NULL, '2025-08-29 03:34:30'),
(7, 'สวยไหม', '/web_jazz/uploads/articles/031f4c502d1441af6bdd0e2d3d0fa8d4.jpg', 'สวยไหม', 'ชุมชนแม่แจ่ม', 'bbbb1', NULL, '2025-08-29 03:46:34'),
(8, 'น่าเบื่อ', '/web_jazz/uploads/articles/13ee56c0cbe481471664748df8e0f6a0.jpg', 'น่าเบื่อ', 'program', 'bbbb1', NULL, '2025-08-29 03:50:55'),
(9, 'นั้นสินะ', NULL, 'นั้นสินะ', 'program', 'bbbb1', NULL, '2025-08-29 04:31:31'),
(10, 'เล่นได้สุดยอดมากๆครับ', NULL, 'เล่นได้สุดยอดมากๆครับ', 'นักเล่นดนตรี', 'nooo', NULL, '2025-08-29 04:43:34'),
(11, 'dfghjkl', NULL, 'dfghjkl', 'program', 'bbbb1', NULL, '2025-08-29 12:46:59'),
(12, 'wertyuiop[', '/web_jazz/uploads/articles/8f25bb54d9f42683140e7d2f76506248.jpg', 'wertyuiop[', 'program', 'bbbb1', NULL, '2025-08-29 12:47:23');

-- --------------------------------------------------------

--
-- Table structure for table `audiofiles`
--

CREATE TABLE `audiofiles` (
  `audioid` int(11) NOT NULL,
  `title` longtext DEFAULT NULL,
  `description` longtext DEFAULT NULL,
  `filepath` longtext DEFAULT NULL,
  `duration` int(11) DEFAULT NULL,
  `filesizemb` double DEFAULT NULL,
  `format` longtext DEFAULT NULL,
  `instrumenttype` longtext DEFAULT NULL,
  `musicalstyle` longtext DEFAULT NULL,
  `contextuse` longtext DEFAULT NULL,
  `communityid` int(11) DEFAULT NULL,
  `thumbnailimage` longtext DEFAULT NULL,
  `recordedby` longtext DEFAULT NULL,
  `recordingdate` date DEFAULT NULL,
  `createdby` int(11) DEFAULT NULL,
  `createdat` datetime DEFAULT current_timestamp(),
  `updatedat` datetime DEFAULT current_timestamp(),
  `ispublished` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `audiofiles`
--

INSERT INTO `audiofiles` (`audioid`, `title`, `description`, `filepath`, `duration`, `filesizemb`, `format`, `instrumenttype`, `musicalstyle`, `contextuse`, `communityid`, `thumbnailimage`, `recordedby`, `recordingdate`, `createdby`, `createdat`, `updatedat`, `ispublished`) VALUES
(1, 'เสียงซึงพื้นบ้าน', 'เสียงซึงบันทึกจากภาคเหนือ', 'https://example.com/sueng.mp3', 120, 3.5, 'mp3', 'เครื่องสาย', 'พื้นบ้าน', 'พิธีกรรม', 1, 'https://example.com/sueng.jpg', 'ครูคำหล้า', '2025-04-10', 1, '2025-05-01 08:00:00', '2025-05-10 10:00:00', 1);

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `comment_id` int(11) NOT NULL,
  `article_id` int(11) DEFAULT NULL,
  `sound_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `content` longtext DEFAULT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `likes` int(11) DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `comments`
--

INSERT INTO `comments` (`comment_id`, `article_id`, `sound_id`, `user_id`, `content`, `parent_id`, `likes`, `created_at`) VALUES
(1, NULL, 1, 2, 'ชอบเสียงนี้มากครับ', NULL, 5, '2025-05-20 14:13:28'),
(2, NULL, 1, 3, 'เพลงเพราะจริงๆ', 1, 2, '2025-05-20 14:13:28'),
(3, 1, NULL, 27, 'good', NULL, 0, '2025-08-29 02:44:36'),
(4, 7, NULL, 27, 'ไปแก้มาเดียวนี้นะ', NULL, 0, '2025-08-29 03:46:57'),
(5, 8, NULL, 27, '(????ﾟヮﾟ)????', NULL, 0, '2025-08-29 04:31:04');

-- --------------------------------------------------------

--
-- Table structure for table `communities`
--

CREATE TABLE `communities` (
  `communityid` int(11) NOT NULL,
  `name` longtext DEFAULT NULL,
  `ethnicgroup` longtext DEFAULT NULL,
  `regiontype` longtext DEFAULT NULL,
  `geography` longtext DEFAULT NULL,
  `culturalnote` longtext DEFAULT NULL,
  `imageurl` longtext DEFAULT NULL,
  `createdat` datetime DEFAULT current_timestamp(),
  `updatedat` datetime DEFAULT current_timestamp(),
  `createdby` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `communities`
--

INSERT INTO `communities` (`communityid`, `name`, `ethnicgroup`, `regiontype`, `geography`, `culturalnote`, `imageurl`, `createdat`, `updatedat`, `createdby`) VALUES
(1, 'ชุมชนแม่แจ่ม', 'ม้ง', 'ภูเขา', 'อำเภอแม่แจ่ม จังหวัดเชียงใหม่', 'มีการใช้เครื่องดนตรีพื้นบ้านในงานขอบคุณผีบรรพบุรุษ', 'https://example.com/community.jpg', '2025-05-01 09:00:00', '2025-05-10 11:00:00', 1),
(5, 'program', 'php', NULL, NULL, 'มีอยากได้งานไหม', '/web_jazz/uploads/communities/f429bcc1130b8f094be0929af540c686.png', '2025-08-29 03:49:29', '2025-08-29 03:49:29', 27),
(6, 'นักเล่นดนตรี', NULL, NULL, NULL, 'เล่นดนตรีกับเพื่อนๆ', '/web_jazz/uploads/communities/e5764ee6b21695dfc4936b857f5b9936.png', '2025-08-29 04:43:05', '2025-08-29 04:43:05', 30);

-- --------------------------------------------------------

--
-- Table structure for table `ethniccommunities`
--

CREATE TABLE `ethniccommunities` (
  `areaid` int(11) NOT NULL,
  `name` longtext DEFAULT NULL,
  `areatype` longtext DEFAULT NULL,
  `region` longtext DEFAULT NULL,
  `reovince` longtext DEFAULT NULL,
  `province` longtext DEFAULT NULL,
  `ethnicgroupid` int(11) DEFAULT NULL,
  `notes` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `ethniccommunities`
--

INSERT INTO `ethniccommunities` (`areaid`, `name`, `areatype`, `region`, `reovince`, `province`, `ethnicgroupid`, `notes`) VALUES
(1, 'ไทยใหญ่', 'เขตเมือง', 'ภาคเหนือ', 'ลำปาง', 'เมืองลำปาง', 1, 'เขตวัฒนธรรมล้านนา');

-- --------------------------------------------------------

--
-- Table structure for table `homepage_content`
--

CREATE TABLE `homepage_content` (
  `setting_key` varchar(50) NOT NULL,
  `setting_value` longtext NOT NULL,
  `description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `homepage_content`
--

INSERT INTO `homepage_content` (`setting_key`, `setting_value`, `description`) VALUES
('card1_desc', 'Experience the vibrant energy of Lanna-Jazz fusion live on stage. Discover our seasonal music festivals, see the event calendar, and book your tickets.', 'รายละเอียดการ์ดสีน้ำเงิน'),
('card1_title', 'Festival<br> Event', 'ชื่อการ์ดสีน้ำเงิน'),
('card2_desc', 'Explore our roster of talented local and international artists. Read their biographies, listen to their music, and discover the faces behind the innovative Lanna-Jazz sound.', 'รายละเอียดการ์ดสีเหลือง'),
('card2_title', 'Musician<br>Network', 'ชื่อการ์ดสีเหลือง'),
('card3_desc', 'Unlock your potential with our groundbreaking curriculum. Learn to blend traditional Lanna instruments with jazz theory through our modular online courses.', 'รายละเอียดการ์ดสีเขียว'),
('card3_title', 'Courses<br>Library', 'ชื่อการ์ดสีเขียว'),
('card4_desc', 'Meet Chiang Mai\'s one-and-only big band. As our flagship ensemble, we fuse the soul of Lanna music with the power of a modern jazz orchestra.', 'รายละเอียดการ์ดสีเทา'),
('card4_title', 'CMSJ<br>Bigband', 'ชื่อการ์ดสีเทา'),
('card5_desc', 'Join the conversation in our online community. This is a space for artists, students, and music lovers to ask questions and share knowledge.', 'รายละเอียดการ์ดสีส้ม'),
('card5_title', 'Forum<br>Q&A', 'ชื่อการ์ดสีส้ม'),
('card6_desc', 'Take a piece of the festival home with you. Browse our exclusive collection of apparel, albums, and unique merchandise.', 'รายละเอียดการ์ดสีชมพู'),
('card6_title', 'Store<br>& Merch', 'ชื่อการ์ดสีชมพู'),
('hero_subtitle', 'Chiang Mai Jazz City: Where ancient melodies meet global rhythms. An innovative project to elevate Lanna and ethnic music to the world stage through the creative language of jazz.', 'ข้อความอธิบายใต้หัวข้อใหญ่'),
('hero_title', 'The Soul of Lanna,<br>The Heart of Jazz', 'หัวข้อใหญ่สุดด้านซ้ายบน (ใช้ <br> เพื่อขึ้นบรรทัดใหม่)'),
('logo_main', 'http://chiangmaijazz.com/wp-content/uploads/2025/12/Learn-More.png', 'โลโก้หลัก (ใส่ URL รูปภาพ)');

-- --------------------------------------------------------

--
-- Table structure for table `instruments`
--

CREATE TABLE `instruments` (
  `instrumentid` int(11) NOT NULL,
  `name` longtext DEFAULT NULL,
  `region` longtext DEFAULT NULL,
  `instrumenttypeid` int(11) DEFAULT NULL,
  `usagecontext` longtext DEFAULT NULL,
  `ethnigroup` longtext DEFAULT NULL,
  `sounddescription` longtext DEFAULT NULL,
  `playingmethnique` longtext DEFAULT NULL,
  `audiosampleurl` longtext DEFAULT NULL,
  `imageurl` longtext DEFAULT NULL,
  `videodemourl` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `instruments`
--

INSERT INTO `instruments` (`instrumentid`, `name`, `region`, `instrumenttypeid`, `usagecontext`, `ethnigroup`, `sounddescription`, `playingmethnique`, `audiosampleurl`, `imageurl`, `videodemourl`) VALUES
(1, 'ซึง', 'ภาคเหนือ', 1, 'การแสดงพื้นบ้าน', 'ไทยวน', 'นุ่ม แหลม', 'ดีดด้วยนิ้วหรือไม้คีบ', 'https://example.com/sueng.mp3', 'https://example.com/sueng.jpg', 'https://example.com/sueng.mp4'),
(2, 'อายุ0', 'ภาคอีสาน', 2, 'การแสดงพื้นบ้าน', 'ไทยใหญ่', 'ดอกไม้นักเรียน ', 'ไค้หันห่วงใยแท็กซี่ผักผีก ', 'https://example.com/audio_0.mp3', 'https://example.com/image_0.jpg', 'https://example.com/video_0.mp4'),
(3, 'ไหน1', 'ภาคใต้', 2, 'พิธีกรรม', 'ปกาเกอะญอ', 'วาดจัดครอง ', 'ฟากถึงเครื่องบินมิตรเมาะ ', 'https://example.com/audio_1.mp3', 'https://example.com/image_1.jpg', 'https://example.com/video_1.mp4'),
(4, 'เลี้ยว2', 'ภาคเหนือ', 3, 'การแสดงพื้นบ้าน', 'ปกาเกอะญอ', 'อัศจรรย์จ๋ายัน ', 'สดแรงงานรัฐบาลจาก ', 'https://example.com/audio_2.mp3', 'https://example.com/image_2.jpg', 'https://example.com/video_2.mp4'),
(5, 'กิ่งไม้3', 'ภาคอีสาน', 1, 'พิธีกรรม', 'ไทยใหญ่', 'ยึดแก ', 'ดองซ่อนไต้หวัน ', 'https://example.com/audio_3.mp3', 'https://example.com/image_3.jpg', 'https://example.com/video_3.mp4'),
(6, 'เสรีนิยม4', 'ภาคกลาง', 1, 'การสอน', 'ปกาเกอะญอ', 'หน้าต่างทดลองผลถีบ ', 'เพราะตะปูเดี่ยวถาง ', 'https://example.com/audio_4.mp3', 'https://example.com/image_4.jpg', 'https://example.com/video_4.mp4');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `notificationid` int(11) NOT NULL,
  `userid` int(11) DEFAULT NULL,
  `type` longtext DEFAULT NULL,
  `title` longtext DEFAULT NULL,
  `message` longtext DEFAULT NULL,
  `isread` tinyint(1) DEFAULT 0,
  `createdat` datetime DEFAULT current_timestamp(),
  `relatedcontentid` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`notificationid`, `userid`, `type`, `title`, `message`, `isread`, `createdat`, `relatedcontentid`) VALUES
(1, 12, 'new_content', 'บทความใหม่: เสียงสะล้อในพิธีไหว้ครู', 'มีบทความใหม่เกี่ยวกับการใช้สะล้อในงานพิธี', 0, '2025-05-13 10:30:00', 205);

-- --------------------------------------------------------

--
-- Table structure for table `playlists`
--

CREATE TABLE `playlists` (
  `playlist_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `playlist_name` varchar(100) DEFAULT 'เพลย์ลิสต์ของฉัน',
  `is_public` tinyint(1) DEFAULT 0,
  `share_url` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `playlists`
--

INSERT INTO `playlists` (`playlist_id`, `user_id`, `playlist_name`, `is_public`, `share_url`, `created_at`) VALUES
(1, 1, 'เพลย์ลิสต์เพลงไทย', 1, 'http://example.com/playlist1', '2025-05-20 14:13:28');

-- --------------------------------------------------------

--
-- Table structure for table `playlist_sounds`
--

CREATE TABLE `playlist_sounds` (
  `playlist_sound_id` int(11) NOT NULL,
  `playlist_id` int(11) DEFAULT NULL,
  `sound_id` int(11) DEFAULT NULL,
  `added_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `playlist_sounds`
--

INSERT INTO `playlist_sounds` (`playlist_sound_id`, `playlist_id`, `sound_id`, `added_at`) VALUES
(1, 1, 1, '2025-05-20 14:13:28'),
(2, 1, 2, '2025-05-20 14:13:28');

-- --------------------------------------------------------

--
-- Table structure for table `popups`
--

CREATE TABLE `popups` (
  `popup_id` int(11) NOT NULL,
  `sound_id` int(11) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `audio_url` varchar(255) DEFAULT NULL,
  `community_name` varchar(255) DEFAULT NULL,
  `latitude` decimal(10,0) DEFAULT NULL,
  `longitude` decimal(10,0) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `description` longtext DEFAULT NULL,
  `share_url` varchar(255) DEFAULT NULL,
  `uploaded_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `popups`
--

INSERT INTO `popups` (`popup_id`, `sound_id`, `title`, `audio_url`, `community_name`, `latitude`, `longitude`, `image_url`, `description`, `share_url`, `uploaded_at`) VALUES
(1, 1, 'เพลงพื้นเมืองซอสามสาย', 'http://example.com/audio1.mp3', 'ชุมชนแม่แจ่ม', 18, 98, 'http://example.com/image1.jpg', 'เพลงพื้นเมืองจากซอสามสาย', 'http://example.com/share1', '2025-05-20 14:13:28');

-- --------------------------------------------------------

--
-- Table structure for table `sounds`
--

CREATE TABLE `sounds` (
  `sound_id` int(11) NOT NULL,
  `instrument_name` varchar(100) DEFAULT NULL,
  `category` varchar(50) DEFAULT NULL,
  `ethnic_group` varchar(100) DEFAULT NULL,
  `community_name` varchar(100) DEFAULT NULL,
  `province` varchar(50) DEFAULT NULL,
  `latitude` decimal(10,0) DEFAULT NULL,
  `longitude` decimal(10,0) DEFAULT NULL,
  `audio_url` varchar(255) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `video_url` varchar(255) DEFAULT NULL,
  `description` longtext DEFAULT NULL,
  `uploaded_by` varchar(100) DEFAULT NULL,
  `uploaded_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sounds`
--

INSERT INTO `sounds` (`sound_id`, `instrument_name`, `category`, `ethnic_group`, `community_name`, `province`, `latitude`, `longitude`, `audio_url`, `image_url`, `video_url`, `description`, `uploaded_by`, `uploaded_at`) VALUES
(1, 'ซอสามสาย', 'เครื่องสาย', 'ไทยใหญ่', 'ชุมชนแม่แจ่ม', 'เชียงใหม่', 18, 98, 'http://example.com/audio1.mp3', 'http://example.com/image1.jpg', NULL, 'เครื่องดนตรีพื้นเมืองของไทยใหญ่', 'alice', '2025-05-20 14:13:28'),
(2, 'ปี่ไม้', 'เครื่องเป่า', NULL, 'ชุมชนลำปาง', 'ลำปาง', 18, 99, 'http://example.com/audio2.mp3', NULL, NULL, 'เสียงปี่ไม้ในงานประเพณี', 'bob', '2025-05-20 14:13:28');

-- --------------------------------------------------------

--
-- Table structure for table `usagecontexts`
--

CREATE TABLE `usagecontexts` (
  `contextid` int(11) NOT NULL,
  `name` longtext DEFAULT NULL,
  `description` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `usagecontexts`
--

INSERT INTO `usagecontexts` (`contextid`, `name`, `description`) VALUES
(1, 'ใช้ในพิธีกรรม', 'ใช้ในพิธีทางศาสนา');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `username` varchar(50) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `last_login` datetime DEFAULT NULL,
  `reset_token` varchar(100) DEFAULT NULL,
  `reset_token_expiry` datetime DEFAULT NULL,
  `sound_id` int(11) DEFAULT NULL,
  `role` varchar(20) NOT NULL DEFAULT 'user',
  `profile_picture_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `email`, `password`, `created_at`, `last_login`, `reset_token`, `reset_token_expiry`, `sound_id`, `role`, `profile_picture_url`) VALUES
(26, 'dfdf', 'ujij@gmail.com', '$2y$10$bZBifc3b5mQb1tURdz4cSuyXDvxtrz/tJWFncBGnZdfZAFKITdwtm', '2025-08-26 21:50:51', '2025-08-26 21:51:39', NULL, NULL, NULL, 'user', NULL),
(27, 'bbbb1', 'bbbb1@gmail.com', '$2y$10$lg1QAApZyExL6eNRC/ILSu75Rt7s346/PrYjcRpCdrtGwXfdmGxTa', '2025-08-26 22:23:15', '2025-08-29 12:45:02', NULL, NULL, NULL, 'user', '/web_jazz/uploads/profiles/user_27_1756416048.jpg'),
(29, 'iq1123', 'vitsanupong2548@gmail.com', '$2y$10$PKYdITEulaBQz7Lx5p0bdu5/odNnVwpfhc10zl.zS5jrgIrF8Pplm', '2025-08-27 10:19:26', '2026-02-21 18:35:34', NULL, NULL, NULL, 'admin', NULL),
(30, 'nooo', 'nooo@gmail.com', '$2y$10$Y2dMDFi9DYgPI7VyRDDqU.A7yrolYZ7OQp0FWNs66Ydv7pQ/S3TgS', '2025-08-29 04:41:20', NULL, NULL, NULL, NULL, 'user', '/web_jazz/uploads/profiles/user_30_1756417313.png');

-- --------------------------------------------------------

--
-- Table structure for table `vocalstyles`
--

CREATE TABLE `vocalstyles` (
  `vocalstyleid` int(11) NOT NULL,
  `name` longtext DEFAULT NULL,
  `context` longtext DEFAULT NULL,
  `musicalstructure` longtext DEFAULT NULL,
  `tonalmode` longtext DEFAULT NULL,
  `vocaltechniqu` longtext DEFAULT NULL,
  `ethnicgroup` longtext DEFAULT NULL,
  `imageurl` longtext DEFAULT NULL,
  `videodemourl` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `analytics`
--
ALTER TABLE `analytics`
  ADD PRIMARY KEY (`analyticsid`);

--
-- Indexes for table `articles`
--
ALTER TABLE `articles`
  ADD PRIMARY KEY (`article_id`);

--
-- Indexes for table `audiofiles`
--
ALTER TABLE `audiofiles`
  ADD PRIMARY KEY (`audioid`);

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`comment_id`);

--
-- Indexes for table `communities`
--
ALTER TABLE `communities`
  ADD PRIMARY KEY (`communityid`);

--
-- Indexes for table `ethniccommunities`
--
ALTER TABLE `ethniccommunities`
  ADD PRIMARY KEY (`areaid`);

--
-- Indexes for table `homepage_content`
--
ALTER TABLE `homepage_content`
  ADD PRIMARY KEY (`setting_key`);

--
-- Indexes for table `instruments`
--
ALTER TABLE `instruments`
  ADD PRIMARY KEY (`instrumentid`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`notificationid`);

--
-- Indexes for table `playlists`
--
ALTER TABLE `playlists`
  ADD PRIMARY KEY (`playlist_id`);

--
-- Indexes for table `playlist_sounds`
--
ALTER TABLE `playlist_sounds`
  ADD PRIMARY KEY (`playlist_sound_id`);

--
-- Indexes for table `popups`
--
ALTER TABLE `popups`
  ADD PRIMARY KEY (`popup_id`);

--
-- Indexes for table `sounds`
--
ALTER TABLE `sounds`
  ADD PRIMARY KEY (`sound_id`);

--
-- Indexes for table `usagecontexts`
--
ALTER TABLE `usagecontexts`
  ADD PRIMARY KEY (`contextid`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `vocalstyles`
--
ALTER TABLE `vocalstyles`
  ADD PRIMARY KEY (`vocalstyleid`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `analytics`
--
ALTER TABLE `analytics`
  MODIFY `analyticsid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `articles`
--
ALTER TABLE `articles`
  MODIFY `article_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `audiofiles`
--
ALTER TABLE `audiofiles`
  MODIFY `audioid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `comment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `communities`
--
ALTER TABLE `communities`
  MODIFY `communityid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `ethniccommunities`
--
ALTER TABLE `ethniccommunities`
  MODIFY `areaid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `instruments`
--
ALTER TABLE `instruments`
  MODIFY `instrumentid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `notificationid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `playlists`
--
ALTER TABLE `playlists`
  MODIFY `playlist_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `playlist_sounds`
--
ALTER TABLE `playlist_sounds`
  MODIFY `playlist_sound_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `popups`
--
ALTER TABLE `popups`
  MODIFY `popup_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `sounds`
--
ALTER TABLE `sounds`
  MODIFY `sound_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `usagecontexts`
--
ALTER TABLE `usagecontexts`
  MODIFY `contextid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `vocalstyles`
--
ALTER TABLE `vocalstyles`
  MODIFY `vocalstyleid` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
