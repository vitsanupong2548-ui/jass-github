-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Feb 27, 2026 at 09:21 PM
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
-- Database: `db5ovpgegfc6yz`
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
(2, 'Chiang Mai Big Band', 'Jazz Bigband', '[{\"type\":\"text\",\"value\":\"asdfasfasfasdfas\",\"layout\":\"col-1\"},{\"type\":\"image\",\"value\":\"uploads\\/cmbigband\\/cmb_content_1772012184_699ec298c8fc3.jpg\",\"layout\":\"col-2\"},{\"type\":\"image\",\"value\":\"uploads\\/cmbigband\\/cmb_content_1772012184_699ec298c929b.jpg\",\"layout\":\"col-2\"}]', 'https://gemini.google.com/u/0/app/203d0c93751c19a8?pageId=none', '09467355959', 'https://gemini.google.com/u/0/app/203d0c93751c19a8?pageId=none', 'https://gemini.google.com/u/0/app/203d0c93751c19a8?pageId=none', 'https://gemini.google.com/u/0/app/203d0c93751c19a8?pageId=none', 'https://gemini.google.com/u/0/app/203d0c93751c19a8?pageId=none', NULL, 'uploads/cmbigband/banner_1772012184_699ec298c86a8.jpg', 'uploads/cmbigband/profile_1772012184_699ec298c8b34.jpg', '2026-02-25 09:36:24');

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
(2, 1, 'Lanna Pi Nae and its Application in Jazz Ensembles', 'Chiang Mai Jazz City', '[{\"type\":\"text\",\"value\":\"<H2>Introduction and Curricular Philosophy<\\/H2>\\r\\n\\r\\n\\r\\n\",\"layout\":\"col-2\"},{\"type\":\"image\",\"value\":\"uploads\\/courses\\/course_content_1772217564_69a1e4dc2f046.jpg\",\"layout\":\"col-2\"},{\"type\":\"text\",\"value\":\"The integration of traditional folk instruments into international musical frameworks, particularly Jazz, which is rooted in improvisation and musical freedom, is a vital process for developing and preserving cultural heritage in a dynamic global context. Lanna music is distinguished by its unique tonal systems, performance styles, and aesthetic philosophies. The Pi Nae, a double reed woodwind instrument of the Lanna culture, possesses significant potential as a lead instrument in contemporary ensembles due to its resonant, piercing timbre and virtuosic performance style.\\r\\n\\r\\nThis report and curriculum are designed as a comprehensive pedagogy for integrating the Pi Nae into Jazz. The learning framework draws on foundational structures from Lanna instruments such as the Salo, Khlui, or Seung, and synergizes them with advanced Jazz harmony, woodwind biomechanics, and electro-acoustic technology. This analysis covers everything from ethnomusicological foundations and instrument acoustics to circular breathing techniques and chordal analysis for full scale improvisation in international musical settings.\",\"layout\":\"col-1\"},{\"type\":\"text\",\"value\":\"<h2>Chapter 1: Ethnomusicology and Organology of the Pi Nae<\\/h2>\\r\\n\\r\\nThe Pi Nae is a traditional wind instrument from the Phayap or Lanna region, classified as a double reed instrument. Its physical characteristics share similarities with the Pi Chawa and Pi Mon of Central Thailand, while also maintaining historical lineages with the Oboe family, the Burmese Hne, and the South Asian Shehnai. In the traditional Lanna musical ecosystem, the Pi Nae serves as the primary melodic lead for outdoor ensembles and large scale rituals, merit making ceremonies, festivals, and various dances. It is a vital component of ensembles such as the Klong Tueng Nong and Klong Teng Thing, where its high volume allows it to pierce through the heavy sound of leather drums and metal percussion.\\r\\n\\r\\nIn the Lanna musical repertoire, the Pi Nae is categorized into two primary types that typically perform in pairs to create a complete sonic dimension: the Pi Nae Noi and the Pi Nae Luang.\\r\\n\\r\\n<b>Pi Nae Noi (Small Pi Nae)<\\/b> : Features a high, piercing pitch and a virtuosic performance style. It functions as a soloist, weaving intricate and flamboyant melodic ornamentations.\\r\\n\\r\\n<b>Pi Nae Luang (Large Pi Nae) <\\/b>: Possesses a deep, resonant tone and serves as the melodic foundation. It plays the core melody with minimal decoration, a technique known in Lanna musical circles as \\\"laur laur\\\" (playing steady, foundational tones) to provide a stable acoustic base for the ensemble.\\r\\n\\r\\n<h2>Conceptual Parallel with Jazz<\\/h2>\",\"layout\":\"col-1\"},{\"type\":\"text\",\"value\":\"The functional division between the Pi Nae Noi, which focuses on improvisation and melodic variation, and the Pi Nae Luang, which maintains the core structure, aligns significantly with the philosophy of Jazz. This genre typically features lead melodic instruments supported by a framework that upholds harmony and rhythm. Furthermore, an academic comparison with the Pi Nai of Central Thai Piphat ensembles reveals that the Pi Nae’s style is more direct and less ornamental. This is largely because most Pi Nae players were folk musicians performing for their livelihoods in social settings, leading to a development of techniques focused on rapid and natural emotional communication. This contrasts with the Pi Nai musicians under royal patronage, who had the resources to develop more complex and rigid formal systems.\",\"layout\":\"col-1\"},{\"type\":\"image\",\"value\":\"uploads\\/courses\\/course_content_1772217564_69a1e4dc2f20e.jpg\",\"layout\":\"col-2\"},{\"type\":\"text\",\"value\":\"<h2>Physical Structure and Acoustics<\\/h2>\\r\\n\\r\\nThe Pi Nae consists of several detachable components, each directly influencing the instrument’s acoustic impedance and timbre. A deep understanding of these elements is essential for musicians aiming to achieve precise pitch control according to international standards.\",\"layout\":\"col-2\"},{\"type\":\"text\",\"value\":\"<b>Component<\\/b>\",\"layout\":\"col-2\"},{\"type\":\"text\",\"value\":\"<b>Physical Characteristics and Acoustic Functions<\\/b>\",\"layout\":\"col-2\"},{\"type\":\"image\",\"value\":\"uploads\\/courses\\/course_content_1772220687_69a1f10f8833b.jpg\",\"layout\":\"col-3\"},{\"type\":\"text\",\"value\":\"Lao Pi (The Body)\",\"layout\":\"col-3\"},{\"type\":\"text\",\"value\":\"The main bore of the instrument, typically crafted from hardwood. For the Pi Nae Noi, it measures approximately 33–35 cm in length. The upper end houses the Kamphuat socket, while 6–7 tone holes are positioned along the body. The specific bore profile and hole placement define the traditional Lanna tuning system.\",\"layout\":\"col-3\"},{\"type\":\"image\",\"value\":\"uploads\\/courses\\/course_content_1772220687_69a1f10f8849f.jpg\",\"layout\":\"col-3\"},{\"type\":\"text\",\"value\":\"Lamphong (The Bell)\",\"layout\":\"col-3\"},{\"type\":\"text\",\"value\":\"The flared distal end, functioning as an acoustic transformer. With a throat width of 6–7 cm and a maximum bell diameter of 12–13 cm, it amplifies the sound, providing the instrument with its characteristic projection and resonance in open spaces.\",\"layout\":\"col-3\"},{\"type\":\"image\",\"value\":\"uploads\\/courses\\/course_content_1772220687_69a1f10f88593.jpg\",\"layout\":\"col-3\"},{\"type\":\"text\",\"value\":\"Kamphuat (The Staple)\",\"layout\":\"col-3\"},{\"type\":\"text\",\"value\":\"A small metal tube, approximately 8 cm long, used to attach the reed to the body. It acts as the primary interface for air pressure, transferring vibrations from the reed into the air column within the Lao Pi.\",\"layout\":\"col-3\"},{\"type\":\"image\",\"value\":\"uploads\\/courses\\/course_content_1772220687_69a1f10f88646.jpg\",\"layout\":\"col-3\"},{\"type\":\"text\",\"value\":\"Lin Pi (The Reed)\",\"layout\":\"col-3\"},{\"type\":\"text\",\"value\":\"A double reed usually made from natural materials like dried palmyra palm leaves. When airflow passes through the blades, it creates the initial vibration. The reed’s stiffness directly dictates the pitch stability and the required blowing pressure.\",\"layout\":\"col-3\"},{\"type\":\"image\",\"value\":\"uploads\\/courses\\/course_content_1772220687_69a1f10f886e2.jpg\",\"layout\":\"col-3\"},{\"type\":\"text\",\"value\":\"Tether String\",\"layout\":\"col-3\"},{\"type\":\"text\",\"value\":\"Since the connection between the Lao Pi and the Lamphong can be loose, especially during high speed performances, a string is used to tether the bell to the upper body for structural stability.\",\"layout\":\"col-3\"},{\"type\":\"text\",\"value\":\"A significant engineering detail lies in the regional variations of tone hole placement. For instance, the Pi Nae from Lampang typically features 6 finger holes and a thumb hole on the back. Conversely, instruments from Chiang Mai and Lamphun generally feature 7 finger holes without a thumb hole.\\r\\n\\r\\nThis 7-hole configuration mirrors the structure of the traditional Lanna flute (Khlui) and offers the highest efficiency for adapting fingerings to play Diatonic and Chromatic scales. This structural flexibility is crucial when the Pi Nae is required to perform alongside a Jazz ensemble, where complex harmonic modulations are frequent.\",\"layout\":\"col-1\"},{\"type\":\"text\",\"value\":\"<h2>Chapter 2: Biomechanics and Advanced Techniques<\\/h2>\\r\\nTo perform the Pi Nae at an international standard and seamlessly integrate it into Jazz, the performer must establish a solid physiological foundation. Breath control, embouchure, and finger dexterity require a deep understanding of scientific and anatomical principles.\\r\\n\\r\\n<h2>Posture and Embouchure<\\/h2>\\r\\nThe orbicularis oris muscle plays a critical role in controlling the Pi Nae reed. The player must insert the reed to an appropriate depth without excessive compression, allowing the reed to vibrate freely. Compressing the lips too tightly results in a shrill, rigid, or fractured tone, while excessive looseness makes it impossible to maintain precise pitch intonation according to international standards. Posture should be upright, whether sitting cross-legged or on a chair, avoiding slouching to allow the diaphragm to expand and contract fully for deep inhalation and sustained exhalation. Both arms should remain relaxed, with wrists free to move, accommodating the rapid and complex finger movements required in Jazz music.\",\"layout\":\"col-1\"},{\"type\":\"image\",\"value\":\"uploads\\/courses\\/course_content_1772220687_69a1f10f8877e.jpg\",\"layout\":\"col-1\"},{\"type\":\"text\",\"value\":\"<h2>Circular Breathing (Aoy Lom)<\\/h2>\\r\\nOne of the most critical techniques and a significant challenge for Western wind players—yet a mandatory prerequisite and the heart of Pi Nae performance—is circular breathing, known in Lanna as \\\"Aoy Lom.\\\" This technique allows the performer to produce a continuous, uninterrupted sound for several minutes. In the context of Jazz improvisation, this opens up possibilities for creating extended phrases, similar to the \\\"Sheets of Sound\\\" concept pioneered by world renowned saxophonist John Coltrane.\",\"layout\":\"col-1\"}]', 'uploads/courses/course_banner_1772220778_69a1f16a0d988.png'),
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
(13, 'An Exclusive Evening with Jean-Loup Longnon & Chiang Mai BigBand A Landmark Collaboration in Jazz Excellence', 'Experience the collision of two worlds: France’s Legendary Virtuoso Meets Thailand’s Finest 18-Piece Ensemble. A cultural exchange that redefines the Southeast Asian Jazz Scene.', '2026-02-24 02:28:00', '2026-02-24 02:31:00', 'Melia Chiang Mai Hotel — Yi Peng Grand Ballroom ', 'Chiang Mai Street Jazz and Melia Chiang Mai proud to present\r\n???????? A Jazz Legend Meets Chiang Mai’s Finest ???????? An Exclusive Evening with Jean-Loup Longnon & Chiang Mai BigBand\r\nPrepare for a landmark musical event. Jean-Loup Longnon, one of the most acclaimed figures in European jazz, is coming to Chiang Mai for a one-night-only performance.\r\nThe Legend  \"Jean-Loup Longnon\" is a titan of the jazz world. A celebrated trumpet virtuoso and composer, he holds the prestigious Prix Django-Reinhardt and is a two-time winner of the Django d\'Or. His resume reads like a history of modern jazz, featuring collaborations with true icons: Dizzy Gillespie, Stan Getz, Clark Terry, and Michel Petrucciani.\r\nFor this exclusive performance, Jean-Loup chose not to bring a band from Europe. Instead, he personally selected the Chiang Mai BigBand (CMBB) to interpret his intricate arrangements. This is a massive vote of confidence. It validates the world-class potential of our local musicians and proves that Chiang Mai is ready to engage with international masters at the highest level.\r\nAll profits support the CMBB National Tour\r\n???? Date: Sunday, February 8th, 2026  \r\n???? Venue: Melia Chiang Mai Hotel — Yi Peng Grand Ballroom \r\n???? Ticket: 850 THB (Includes 1 Welcome Drink) \r\n???? Privilege: Ticket holders get 15% discount at Mai The Sky Bar after the show.', 'uploads/events/banner_1772035159_699f1c57a1c65.jpg', 'uploads/events/poster_1772035159_699f1c57a1db5.jpg', 'uploads/events/venue_1772035159_699f1c57a1e4c.jpg', ' Yi Peng Grand Ballroom, Meliá Chiang Mai ', '', '<iframe src=\"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3354.3106304628263!2d99.00020741019513!3d18.78529968228683!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30da3bae54e74dd3%3A0x4db450713b90aedf!2sMeli%C3%A1%20Chiang%20Mai!5e1!3m2!1sen!2sth!4v1772035137795!5m2!1sen!2sth\" width=\"600\" height=\"450\" style=\"border:0;\" allowfullscreen=\"\" loading=\"lazy\" referrerpolicy=\"no-referrer-when-downgrade\"></iframe>', '[\"uploads\\/events\\/gallery_1772035289_699f1cd966623_0.jpg\",\"uploads\\/events\\/gallery_1772035289_699f1cd966763_1.jpg\",\"uploads\\/events\\/gallery_1772035289_699f1cd96681b_2.jpg\",\"uploads\\/events\\/gallery_1772035289_699f1cd9668b6_3.jpg\",\"uploads\\/events\\/gallery_1772035289_699f1cd96696e_4.jpg\"]', '2026-02-23 19:30:20'),
(14, 'Jazz Arabica 2025', 'A Festival of Creativity: Where Opportunity Meets the Dreams of Tomorrow.', '2025-11-05 10:00:00', '2025-11-07 23:59:00', 'Jing Jai Market, North Gate Spirit', 'Jazz Arabica #3 ????????\r\nThe CMSJ team, in collaboration with Chiang Mai Touch Social Enterprise, proudly presents the 3rd Jazz Arabica Festival.\r\nWhen people, community, and dreams meet again. The \"3rd Jazz Arabica Festival\" is a space for sharing stories and inspiration, woven from upstream to downstream.\r\nWe invite you to experience the way of life of our brothers and sisters from the diverse cultures of Northern Thailand through melodies and unique community products. Come and listen to the story of \"Bringing Dreams and Opportunities Back Home\"—a small yet powerful force creating sustainable change for the community and society.\r\n.\r\nJoin us in sharing these wonderful stories from November 5-7, 2025.\r\n????️ November 5, 2025\r\n6:00 PM - 9:00 PM at Jing Jai Market\r\n✨ “Highland Heritage: Long Table Dinner”: An evening meal at a long table, featuring heritage cuisine from the mountains.\r\n????️ November 6, 2025\r\n9:00 AM - 6:30 PM at Jing Jai Market\r\nExplore community products including coffee, tea, honey, naturally dyed woven fabrics, local rice, and regional foods.\r\nParticipate in workshops.\r\nEnjoy captivating ethnic and jazz music performances.\r\n????️ November 7, 2025\r\n5:00 PM - 8:00 PM at North Gate Spirit\r\n✨ Experience the story of \"People, Bees, and the Forest\" while enjoying live music and a special \"Honey Cocktail\" menu from Baan Huai Hin Lad Nai, Chiang Rai.\r\n.\r\nThis year, we have created special souvenirs. All proceeds after expenses will support our community development mission (Land Scape Change). We hope you will follow and support our journey!\r\n.\r\nFor more information and updates:\r\nFacebook: Chiangmai Touch\r\nInstagram: Chiangmai_touch\r\nLine: @chiangmai.touch\r\nor https://lin.ee/EovI7z9\r\nWebsite: https://chiangmaitouch.org', 'uploads/events/banner_1772034599_699f1a270ab24.jpg', 'uploads/events/poster_1772034599_699f1a270ace8.jpg', 'uploads/events/venue_1772034599_699f1a270b055.jpg', 'Jing Jai Market', '', '<iframe src=\"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3353.8985140737414!2d98.99307441019572!3d18.80598438227011!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30da3ac0cb5efccd%3A0x9fbfb1d2cc918b06!2sJing%20Jai%20Market%20Chiang%20Mai!5e1!3m2!1sen!2sth!4v1772034393157!5m2!1sen!2sth\" width=\"600\" height=\"450\" style=\"border:0;\" allowfullscreen=\"\" loading=\"lazy\" referrerpolicy=\"no-referrer-when-downgrade\"></iframe>', '[\"uploads\\/events\\/gallery_1772034599_699f1a270b20a_0.jpg\",\"uploads\\/events\\/gallery_1772034599_699f1a270b314_1.jpg\",\"uploads\\/events\\/gallery_1772034599_699f1a270b441_2.jpg\",\"uploads\\/events\\/gallery_1772034599_699f1a270b57e_3.jpg\",\"uploads\\/events\\/gallery_1772034599_699f1a270b717_4.jpg\",\"uploads\\/events\\/gallery_1772034599_699f1a270b840_5.jpg\",\"uploads\\/events\\/gallery_1772034599_699f1a270b95e_6.jpg\",\"uploads\\/events\\/gallery_1772034599_699f1a270ba74_7.jpg\",\"uploads\\/events\\/gallery_1772034599_699f1a270bb7b_8.jpg\",\"uploads\\/events\\/gallery_1772034599_699f1a270bcfe_9.jpg\"]', '2026-02-24 05:04:19'),
(16, 'Chaing Mai Street Jazz Festival 2025', 'Chiang Mai JAzz City', '2025-12-01 18:00:00', '2025-12-07 23:59:00', 'Old Chiangmai Cultural Center', 'Chiang Mai Street Jazz Festival 2025\r\nThe 7th Chiang Mai Street Jazz Festival\r\n“Chiang Mai Jazz City: Let the City Play its Jazz”\r\n\r\nWhat if a place wasn’t remembered by its sights, but instead by its sounds?\r\nChiang Mai is discovering its identity through a new melody, and that language is ‘Jazz.’\r\n‘Jazz’ isn’t just imported music; it is an embraced culture. It is the charm of improvisation, seeping into the daily lives of the city’s people. It is a dialogue that arises between cultural heritage and the pulse of the modern era.\r\nA “Jazz City” doesn’t mean a city with performance stages, but a city where the entire city becomes the stage. It is a city where the chatter of people, the rhythm of the wind, and the colors of the streets merge and are played out as a single song.\r\nThe 7th Chiang Mai Street Jazz Festival is a celebration where the line between artist and audience blurs, and we all become part of a grand orchestra named “Chiang Mai.”\r\nWe invite you to be part of an experience where the entire city rises to play jazz together. From December 1-4, with street jazz performances in the old town; December 5-6, 2025, with mini-concerts at leading jazz bars across the city: Moment’s Notice Jazz Club, The Mellowship Jazz Club, Mahoree City of Music, Karmar Community Space, and The North Gate Jazz Co-op; and on December 7, 2025, the main stage event at the Old Chiang Mai Cultural Center.\r\nCome, let’s play our city’s song, loud and clear.\r\nEarly Bird tickets are available at a special price from 20 July until September 30, 2025, at:\r\n', 'uploads/events/banner_1772030568_699f0a688ed0d.jpg', 'uploads/events/poster_1772030568_699f0a688eecd.jpg', 'uploads/events/venue_1772030568_699f0a688f116.jpg', 'Old Chiangmai Cultural Center', '', '<iframe src=\"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3354.571504725366!2d98.97752731019477!3d18.772194682297318!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30da30707126c48d%3A0xd1745bfec3160e06!2sOld%20Chiangmai%20Cultural%20Center!5e1!3m2!1sen!2sth!4v1772030496605!5m2!1sen!2sth\" width=\"600\" height=\"450\" style=\"border:0;\" allowfullscreen=\"\" loading=\"lazy\" referrerpolicy=\"no-referrer-when-downgrade\"></iframe>', '[\"uploads\\/events\\/gallery_1772030568_699f0a688f254_0.jpg\",\"uploads\\/events\\/gallery_1772030568_699f0a688f7eb_1.jpg\",\"uploads\\/events\\/gallery_1772030568_699f0a688fc55_2.jpg\",\"uploads\\/events\\/gallery_1772030568_699f0a68901b4_3.jpg\",\"uploads\\/events\\/gallery_1772030568_699f0a6890738_4.jpg\",\"uploads\\/events\\/gallery_1772030568_699f0a6890c3d_5.jpg\",\"uploads\\/events\\/gallery_1772030568_699f0a68911ce_6.jpg\",\"uploads\\/events\\/gallery_1772030568_699f0a68917a1_7.jpg\",\"uploads\\/events\\/gallery_1772030568_699f0a6891d44_8.jpg\",\"uploads\\/events\\/gallery_1772030568_699f0a6892401_9.jpg\"]', '2026-02-24 06:48:05'),
(20, 'Chiang Mai Street Jazz Big Band LIVE at North Gate Jazz Co-op', '', '2025-06-02 21:45:00', '2025-06-02 22:45:00', 'North Gate Jazz Co-op ', '???????? Chiang Mai Street Jazz Big Band LIVE at North Gate Jazz Co-op ????????\r\nDate: Monday, 2 June 2025\r\nTime: 21:45\r\nVenue: North Gate Jazz Co-op (Old City, Chiang Mai)\r\n???? Free entry – first come, first swing! ????\r\nPrepare for an explosive night of big-band energy as more than 20 of Chiang Mai’s finest jazz musicians join forces on one stage. Expect classic swing, modern grooves, and plenty of space for soaring solos. Grab your friends, claim a table early, and let the horns do the talking!\r\n???? Follow @ChiangMaiStreetJazz for updates. See you under the green neon!', 'uploads/events/banner_1772036786_699f22b27baf6.jpg', 'uploads/events/poster_1772036786_699f22b27be0f.jpg', 'uploads/events/venue_1772036786_699f22b27c04f.jpg', 'The North Gate Jazz Co-Op', '', '<iframe src=\"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3354.1128403830876!2d98.9844916101954!3d18.795229782278756!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30da3a9725192b57%3A0x81bb3e0b9483c631!2sThe%20North%20Gate%20Jazz%20Co-Op!5e1!3m2!1sen!2sth!4v1772036768881!5m2!1sen!2sth\" width=\"600\" height=\"450\" style=\"border:0;\" allowfullscreen=\"\" loading=\"lazy\" referrerpolicy=\"no-referrer-when-downgrade\"></iframe>', '[]', '2026-02-24 20:46:33'),
(21, 'Chiang Mai Street Jazz Bigband LIVE at Moment’s Notice Jazz Club ', 'A full-power big band in an intimate room tight horns, roaring swing, and modern grooves all night.', '2025-09-18 21:30:00', '2025-09-18 22:30:00', 'Moment’s Notice Jazz Club', 'Chiang Mai Street Jazz Bigband LIVE at Moment’s Notice Jazz Club ????\r\n\r\nA full-power big band in an intimate room tight horns, roaring swing, and modern grooves all night.\r\n\r\nDate: Thursday, 18 September 2025\r\nTime: 21:30\r\nVenue: Moment’s Notice Jazz Club\r\nEntry: Free first come, first served\r\n\r\nArrive early to secure your seat; the club fills fast.\r\n', 'uploads/events/banner_1772036073_699f1fe9c049a.jpg', 'uploads/events/poster_1772036073_699f1fe9c05bf.jpg', 'uploads/events/venue_1772036073_699f1fe9c0725.jpg', '', '', '<iframe src=\"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2087.558902059924!2d98.98115007492035!3d18.773025764336754!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30da3b166f87d877%3A0x684830c8be282862!2sMoment&#39;s%20Notice%20Jazz%20Club!5e1!3m2!1sen!2sth!4v1772036062891!5m2!1sen!2sth\" width=\"600\" height=\"450\" style=\"border:0;\" allowfullscreen=\"\" loading=\"lazy\" referrerpolicy=\"no-referrer-when-downgrade\"></iframe>', '[]', '2026-02-25 16:14:33'),
(22, 'Chiang Mai International Jazz Week 2025', 'Let\'s celebrate UNESCO International Jazz Day Chiang Mai-style!', '2025-04-30 18:00:00', '2025-05-04 23:59:00', 'North Gate Jazz Co-op, The Mellowship Jazz Club, Moment’s Notice Jazz Club', 'Let\'s celebrate UNESCO International Jazz Day Chiang Mai-style!\r\nJoin us from 30 April – 4 May 2025 at Chiang Mai\'s favorite jazz venues:\r\n\r\nPlus, enjoy live music by various fantastic local jazz bands every night! ????✨\r\nFree Entry! Don\'t miss this vibrant celebration of jazz music in the heart of Chiang Mai!\r\nStay tuned for more details at:', 'uploads/events/banner_1772037416_699f2528ddda6.jpg', 'uploads/events/poster_1772037416_699f2528ddf9b.jpg', NULL, '', 'North Gate Jazz Co-op, The Mellowship Jazz Club, Moment’s Notice Jazz Club', '', '[]', '2026-02-25 16:36:56');

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
(50, 16, '2025-12-07', '17:30:00', 'OLD CHIANGMAI CULTURAL CENTER', 'Chiang mai Big Band', '2026-02-25 14:42:48'),
(51, 16, '2025-12-07', '19:00:00', 'OLD CHIANGMAI CULTURAL CENTER', 'Rossy Rose Carniel Trio', '2026-02-25 14:42:48'),
(52, 16, '2025-12-07', '20:20:00', 'OLD CHIANGMAI CULTURAL CENTER', 'Yoh Duck Quartet Feat. Krit Buranavitayawut', '2026-02-25 14:42:48'),
(53, 16, '2025-12-07', '21:40:00', 'OLD CHIANGMAI CULTURAL CENTER', 'Gen-Z Quartet', '2026-02-25 14:42:48'),
(54, 16, '2025-12-07', '23:00:00', 'OLD CHIANGMAI CULTURAL CENTER', 'Groovy Doopy x Rachael', '2026-02-25 14:42:48'),
(55, 14, '2025-11-05', '18:00:00', 'Jing Jai Market', 'Highland Heritage : Long Table Dinner', '2026-02-25 15:49:59'),
(56, 14, '2025-11-05', '18:00:00', 'Jing Jai Market', '“Highland Heritage: Long Table Dinner”: An evening meal at a long table, featuring heritage cuisine from the mountains.', '2026-02-25 15:49:59'),
(57, 14, '2025-11-07', '17:00:00', 'North Gate Spirit', 'Experience the story of \"People, Bees, and the Forest\" while enjoying live music and a special \"Honey Cocktail\" menu from Baan Huai Hin Lad Nai, Chiang Rai.', '2026-02-25 15:49:59'),
(62, 13, '2026-02-08', '18:00:00', 'Melia Chiang Mai Hotel — Yi Peng Grand Ballroom', 'Doors Open Arrive early for cocktails, canapes, and conversation with fellow jazz lovers in an elegant ballroom setting.', '2026-02-25 16:01:29'),
(63, 13, '2026-02-08', '19:00:00', 'Melia Chiang Mai Hotel — Yi Peng Grand Ballroom', 'First Set', '2026-02-25 16:01:29'),
(64, 13, '2026-02-08', '19:45:00', 'Melia Chiang Mai Hotel — Yi Peng Grand Ballroom', 'Intermission & Open Bar', '2026-02-25 16:01:29'),
(65, 13, '2026-02-08', '20:15:00', 'Melia Chiang Mai Hotel — Yi Peng Grand Ballroom', 'Second Set', '2026-02-25 16:01:29'),
(67, 20, '2025-06-02', '21:45:00', 'North Gate Jazz Co-op', 'Chiang Mai Street Jazz Big Band', '2026-02-25 16:26:26'),
(68, 21, '2026-09-18', '21:30:00', 'Moment’s Notice Jazz Club', 'Chiang Mai Street Jazz Bigband LIVE', '2026-02-25 16:27:33'),
(76, 22, '2025-05-01', '20:00:00', 'North Gate Jazz Co-op', 'CMSJ BIGBAND', '2026-02-25 16:39:06'),
(77, 22, '2025-05-02', '16:00:00', 'Moment’s Notice Jazz Club', 'Level Up Workshop by Mathieu Franceschi', '2026-02-25 16:39:06'),
(78, 22, '2025-05-02', '20:00:00', 'The Mellowship Jazz Club', 'CMSJ BIGBAND', '2026-02-25 16:39:06'),
(79, 22, '2025-05-02', '21:00:00', 'The Mellowship Jazz Club', 'JAM SESSION: Hosted by Dandylion', '2026-02-25 16:39:06'),
(80, 22, '2025-05-02', '21:30:00', 'Moment’s Notice Jazz Club', 'MNJB : Tribute to Tony Bennett & Lady Gaga', '2026-02-25 16:39:06'),
(81, 22, '2025-05-03', '21:30:00', 'Moment’s Notice Jazz Club', 'MNJB : Hollywood Jazz Night', '2026-02-25 16:39:06'),
(82, 22, '2025-05-04', '21:15:00', 'Moment’s Notice Jazz Club', 'JAM SESSION: Hosted by ATM Trio at Moment’s Notice Jazz Club', '2026-02-25 16:39:06');

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
(88, 13, 'Adult Ticket', '', 850.00, 160, 0);

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
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `event_lineups`
--
ALTER TABLE `event_lineups`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=83;

--
-- AUTO_INCREMENT for table `event_tickets`
--
ALTER TABLE `event_tickets`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=89;

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
