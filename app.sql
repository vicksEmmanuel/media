-- phpMyAdmin SQL Dump
-- version 4.8.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 12, 2018 at 10:01 AM
-- Server version: 10.1.34-MariaDB
-- PHP Version: 7.2.7

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `app`
--

-- --------------------------------------------------------

--
-- Table structure for table `albums`
--

CREATE TABLE `albums` (
  `id` int(10) UNSIGNED NOT NULL,
  `album_name` text NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `privacy` enum('Public','Private','Password') NOT NULL,
  `genres` text NOT NULL,
  `artist_name` text NOT NULL,
  `description` text NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `album_artwork_path` text NOT NULL,
  `album_path` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `audios`
--

CREATE TABLE `audios` (
  `id` int(10) UNSIGNED NOT NULL,
  `album_name` text NOT NULL,
  `year_created` year(4) NOT NULL,
  `audio_name` text NOT NULL,
  `artist_name` text NOT NULL,
  `privacy` enum('Public','Private','Password') NOT NULL,
  `description` text NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `genres` text NOT NULL,
  `album_artwork_path` text NOT NULL,
  `audio_path` text NOT NULL,
  `pcm` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `genres`
--

CREATE TABLE `genres` (
  `id` int(10) UNSIGNED NOT NULL,
  `genres` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `genres`
--

INSERT INTO `genres` (`id`, `genres`) VALUES
(1, 'Alternative'),
(2, 'Art Punk'),
(3, 'Alternative Rock'),
(4, 'College Rock'),
(5, 'Crossover Thrash'),
(6, 'Crust Punk'),
(7, 'Experimental Rock'),
(8, 'Folk Punk'),
(9, 'Goth / Gothic Rock'),
(10, 'Grunge'),
(11, 'Hardcore Punk'),
(12, 'Hard Rock'),
(13, 'Indie Rock'),
(14, 'Lo-fi'),
(15, 'New Wave'),
(16, 'Progressive Rock'),
(17, 'Punk'),
(18, 'Shoegaze'),
(19, 'Steampunk'),
(20, 'Anime'),
(21, 'Blues'),
(22, 'Acoustic Blues'),
(23, 'Chicago Blues'),
(24, 'Classic Blues'),
(25, 'Contemporary Blues'),
(26, 'Country Blues'),
(27, 'Delta Blues'),
(28, 'Electric Blues'),
(29, 'Ragtime Blues'),
(30, 'Children\'s Music'),
(31, 'Lullabies'),
(32, 'Sing-Along'),
(33, 'Stories'),
(34, 'Classical'),
(35, 'Avant-Garde'),
(36, 'Baroque'),
(37, 'Chamber Music'),
(38, 'Chant'),
(39, 'Choral'),
(40, 'Classical Crossover'),
(41, 'Contemporary Classical'),
(42, 'Early Music'),
(43, 'Expressionist'),
(44, 'High Classical'),
(45, 'Impressionist'),
(46, 'Medieval'),
(47, 'Minimalism'),
(48, 'Modern Composition'),
(49, 'Opera'),
(50, 'Orchestral'),
(51, 'Renaissance'),
(52, 'Romantic'),
(53, 'Wedding Music'),
(54, 'Comedy'),
(55, 'Novelty'),
(56, 'Standup Comedy'),
(57, 'Vaudeville'),
(58, 'Commercial'),
(59, 'Jingles'),
(60, 'TV Themes'),
(61, 'Country'),
(62, 'Alternative Country'),
(63, 'Americana'),
(64, 'Bluegrass'),
(65, 'Contemporary Bluegrass'),
(66, 'Contemporary Country'),
(67, 'Country Gospel'),
(68, 'Country Pop'),
(69, 'Honky Tonk'),
(70, 'Outlaw Country'),
(71, 'Traditional Bluegrass'),
(72, 'Traditional Country'),
(73, 'Urban Cowboy'),
(74, 'Club / Club Dance'),
(75, 'Breakcore'),
(76, 'Breakbeat / Breakstep'),
(77, 'Brostep'),
(78, 'Chillstep'),
(79, 'Deep House'),
(80, 'Dubstep'),
(81, 'Electro House'),
(82, 'Electroswing'),
(83, 'Exercise'),
(84, 'Future Garag'),
(85, 'Garage'),
(86, 'Glitch Hop'),
(87, 'Glitch Pop'),
(88, 'Grime'),
(89, 'Hardcore'),
(90, 'Hard Dance'),
(91, 'Hi-NRG / Eurodance'),
(92, 'Horrorcore'),
(93, 'House'),
(94, 'Jackin House'),
(95, 'Jungle / Drum and bass'),
(96, 'Liquid Dub'),
(97, 'Regstep'),
(98, 'Speedcore'),
(99, 'Techno'),
(100, 'Trance'),
(101, 'Trap'),
(102, 'Disney'),
(103, 'Easy Listening'),
(104, 'Bop'),
(105, 'Lounge'),
(106, 'Swing'),
(107, 'Electronic'),
(108, '2-Step'),
(109, '8bit'),
(110, 'Ambient'),
(111, 'Bassline'),
(112, 'Chillwave'),
(113, 'Chiptune'),
(114, 'Crunk'),
(115, 'Downtempo'),
(116, 'Drum & Bass'),
(117, 'Electro'),
(118, 'Electro-swing'),
(119, 'Electronica'),
(120, 'Electronic Rock'),
(121, 'Hardstyle'),
(122, 'IDM/Experimental'),
(123, 'Industrial'),
(124, 'Trip Hop'),
(125, 'Enka'),
(126, 'French Pop'),
(127, 'German Folk'),
(128, 'German Pop'),
(129, 'Fitness and Workout'),
(130, 'Hip-Hop/Rap'),
(131, 'Alternative Rap'),
(132, 'Bounce'),
(133, 'Dirty South'),
(134, 'East Coast Rap'),
(135, 'Gangsta Rap'),
(136, 'Hardcore Rap'),
(137, 'Hip-Hop'),
(138, 'Latin Rap'),
(139, 'Old School Rap'),
(140, 'Rap'),
(141, 'Turntablism'),
(142, 'Underground Rap'),
(143, 'West Coast Rap'),
(144, 'Holiday'),
(145, 'Chanukah'),
(146, 'Christmas'),
(147, 'Christmas- Children'),
(148, 'Christmas- Classic'),
(149, 'Christmas- Classical'),
(150, 'Christmas- Comedy'),
(151, 'Christmas- Jazz'),
(152, 'Christmas- Modern'),
(153, 'Christmas- Pop'),
(154, 'Christmas- R&B'),
(155, 'Christmas- Religious'),
(156, 'Christmas- Rock'),
(157, 'Easter'),
(158, 'Halloween'),
(159, 'Holiday: Other'),
(160, 'Thanksgiving'),
(161, 'Indie Pop'),
(162, 'Industrial'),
(163, 'Inspirational'),
(164, 'Christian and Gospel'),
(165, 'CCM'),
(166, 'Christian Metal'),
(167, 'Christian Pop'),
(168, 'Christian Rap'),
(169, 'Christian Rock'),
(170, 'Classic Christian'),
(171, 'Contemporary Gospel'),
(172, 'Gospel'),
(173, 'Christian and Gospel'),
(174, 'Praise and Worship'),
(175, 'Qawwali'),
(176, 'Southern Gospel'),
(177, 'Traditional Gospel'),
(178, 'Instrumental'),
(179, 'March'),
(180, 'J-Pop'),
(181, 'J-Rock'),
(182, 'J-Synth'),
(183, 'J-Ska'),
(184, 'J-Punk'),
(185, 'Acid Jazz'),
(186, 'Avant-Garde Jazz'),
(187, 'Bebop'),
(188, 'Big Band'),
(189, 'Blue Note'),
(190, 'Contemporary Jazz'),
(191, 'Cool'),
(192, 'Crossover Jazz'),
(193, 'Dixieland'),
(194, 'Ethio-jazz'),
(195, 'Fusion'),
(196, 'Gypsy Jazz'),
(197, 'Hard Bop'),
(198, 'Latin Jazz'),
(199, 'Mainstream Jazz'),
(200, 'Ragtime'),
(201, 'Smooth Jazz'),
(202, 'Trad Jazz'),
(203, 'K-Pop'),
(204, 'Karaoke'),
(205, 'Kayokyoku'),
(206, 'Latin'),
(207, 'Alternativo and Rock Latino'),
(208, 'Argentine tango'),
(209, 'Baladas y Boleros'),
(210, 'Bossa Nova'),
(211, 'Brazilian'),
(212, 'Contemporary Latin'),
(213, 'Cumbia'),
(214, 'Flamenco / Spanish Flamenco'),
(215, 'Latin Jazz'),
(216, 'Nuevo Flamenco'),
(217, 'Pop Latino'),
(218, 'Portuguese fado'),
(219, 'Raíces'),
(220, 'Reggaeton y Hip-Hop'),
(221, 'Regional Mexicano'),
(222, 'Salsa y Tropical'),
(223, 'Environmental'),
(224, 'Healing'),
(225, 'Meditation'),
(226, 'Nature'),
(227, 'Relaxation'),
(228, 'Travel'),
(229, 'Adult Contemporary'),
(230, 'Britpop'),
(231, 'Bubblegum Pop'),
(232, 'Chamber Pop'),
(233, 'Dance Pop'),
(234, 'Dream Pop'),
(235, 'Electro Pop'),
(236, 'Orchestral Pop'),
(237, 'Pop/Rock'),
(238, 'Pop Punk'),
(239, 'Power Pop'),
(240, 'Soft Rock'),
(241, 'Synthpop'),
(242, 'Teen Pop'),
(243, 'Contemporary R&amp;B'),
(244, 'Disco'),
(245, 'Doo Wop'),
(246, 'Funk'),
(247, 'Modern Soul'),
(248, 'Motown'),
(249, 'Neo-Soul'),
(250, 'Northern Soul'),
(251, 'Psychedelic Soul'),
(252, 'Quiet Storm'),
(253, 'Soul'),
(254, 'Soul Blues'),
(255, 'Southern Soul'),
(256, '2-Tone'),
(257, 'Dancehall'),
(258, 'Dub'),
(259, 'Roots Reggae'),
(260, 'Ska'),
(261, 'Acid Rock'),
(262, 'Adult-Oriented Rock'),
(263, 'Afro Punk'),
(264, 'Adult Alternative'),
(265, 'Alternative Rock'),
(266, 'American Trad Rock'),
(267, 'Anatolian Rock'),
(268, 'Arena Rock'),
(269, 'Art Rock'),
(270, 'Blues-Rock'),
(271, 'British Invasion'),
(272, 'Cock Rock'),
(273, 'Death Metal / Black Metal'),
(274, 'Doom Metal'),
(275, 'Glam Rock'),
(276, 'Gothic Metal'),
(277, 'Grind Core'),
(278, 'Hair Metal'),
(279, 'Hard Rock'),
(280, 'Math Metal'),
(281, 'Math Rock'),
(282, 'Metal'),
(283, 'Metal Core'),
(284, 'Noise Rock'),
(285, 'Jam Bands'),
(286, 'Post Punk'),
(287, 'Prog-Rock/Art Rock'),
(288, 'Progressive Metal'),
(289, 'Psychedelic'),
(290, 'Rock and Roll'),
(291, 'Roots Rock'),
(292, 'Singer/Songwriter'),
(293, 'Southern Rock'),
(294, 'Spazzcore'),
(295, 'Stoner Metal'),
(296, 'Surf'),
(297, 'Technical Death Metal'),
(298, 'Tex-Mex'),
(299, 'Time Lord Rock'),
(300, 'Trash Metal'),
(301, 'Alternative Folk'),
(302, 'Contemporary Folk'),
(303, 'Contemporary Singer/Songwriter'),
(304, 'Indie Folk'),
(305, 'Folk-Rock'),
(306, 'Love Song'),
(307, 'New Acoustic'),
(308, 'Traditional Folk'),
(309, 'Foreign Cinema'),
(310, 'Movie Soundtrack'),
(311, 'Musicals'),
(312, 'Original Score'),
(313, 'Soundtrack'),
(314, 'TV Soundtrack'),
(315, 'Chicano'),
(316, 'Classic'),
(317, 'Conjunto'),
(318, 'Conjunto Progressive'),
(319, 'New Mex'),
(320, 'Tex-Mex'),
(321, 'A cappella'),
(322, 'Barbershop'),
(323, 'Doo-wop '),
(324, 'Gregorian Chant'),
(325, 'Standards'),
(326, 'Traditional Pop'),
(327, 'Vocal Jazz'),
(328, 'Vocal Pop'),
(329, 'Africa'),
(330, 'Afro-Beat'),
(331, 'Afro-Pop'),
(332, 'Asia'),
(333, 'Australia'),
(334, 'Cajun'),
(335, 'Calypso'),
(336, 'Caribbean'),
(337, 'Carnatic'),
(338, 'Celtic'),
(339, 'Celtic Folk'),
(340, 'Contemporary Celtic'),
(341, 'Dangdut'),
(342, 'Drinking Songs'),
(343, 'Drone'),
(344, 'Europe'),
(345, 'France'),
(346, 'Hawaii'),
(347, 'Hindustani'),
(348, 'Indian Ghazal'),
(349, 'Indian Pop'),
(350, 'Japan'),
(351, 'Japanese Pop'),
(352, 'Klezmer'),
(353, 'Mbalax'),
(354, 'Senegal'),
(355, 'Middle East'),
(356, 'North America'),
(357, 'Ode'),
(358, 'Piphat'),
(359, 'Thailand'),
(360, 'Polka'),
(361, 'Soca'),
(362, 'South Africa'),
(363, 'South America'),
(364, 'Traditional Celtic'),
(365, 'Worldbeat'),
(366, 'Zydeco');

-- --------------------------------------------------------

--
-- Table structure for table `image_processing_talk`
--

CREATE TABLE `image_processing_talk` (
  `id` int(10) UNSIGNED NOT NULL,
  `file_path` text NOT NULL,
  `file_name` text NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `media`
--

CREATE TABLE `media` (
  `id` int(10) UNSIGNED NOT NULL,
  `type` enum('video','audio') NOT NULL,
  `privacy` enum('Public','Private','Password') NOT NULL,
  `id_media` int(10) UNSIGNED NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `user_id` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `playlist`
--

CREATE TABLE `playlist` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `playlist_name` text NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `privacy` enum('Public','Private','Password') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `talk`
--

CREATE TABLE `talk` (
  `id` int(10) UNSIGNED NOT NULL,
  `file_path` text NOT NULL,
  `file_name` text NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(10) UNSIGNED NOT NULL,
  `email` varchar(200) NOT NULL,
  `password` text NOT NULL,
  `user_dir` text NOT NULL,
  `profile_image` text NOT NULL,
  `username` varchar(100) NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `company_format` enum('individual','business') NOT NULL,
  `authenticated` enum('true','false') NOT NULL,
  `phone_num` varchar(15) DEFAULT NULL,
  `address` text,
  `website` text,
  `cover_image` text,
  `country` text
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `video`
--

CREATE TABLE `video` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `playlist_id` int(10) UNSIGNED NOT NULL,
  `category` text NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `description` text NOT NULL,
  `title` text NOT NULL,
  `privacy` enum('Public','Password','Private') NOT NULL,
  `thubnail_path` text NOT NULL,
  `video_path` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `video_category`
--

CREATE TABLE `video_category` (
  `id` int(10) UNSIGNED NOT NULL,
  `category` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `video_category`
--

INSERT INTO `video_category` (`id`, `category`) VALUES
(1, 'Autos and Vehicles'),
(2, 'Comedy'),
(3, 'Education'),
(4, 'Entertainment'),
(5, 'Film and Animation'),
(6, 'Gaming'),
(7, 'Howto and Style'),
(8, 'Music'),
(9, 'News and Politics'),
(10, 'Nonprofits and Activism'),
(11, 'People and Blogs'),
(12, 'Pets and Animals'),
(13, 'Science and Technology'),
(14, 'Sports'),
(15, 'Travels and Events'),
(16, 'VideoBlogging');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `albums`
--
ALTER TABLE `albums`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `audios`
--
ALTER TABLE `audios`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `genres`
--
ALTER TABLE `genres`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `image_processing_talk`
--
ALTER TABLE `image_processing_talk`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `media`
--
ALTER TABLE `media`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `playlist`
--
ALTER TABLE `playlist`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `talk`
--
ALTER TABLE `talk`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `video`
--
ALTER TABLE `video`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `video_category`
--
ALTER TABLE `video_category`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `albums`
--
ALTER TABLE `albums`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `audios`
--
ALTER TABLE `audios`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `genres`
--
ALTER TABLE `genres`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=367;

--
-- AUTO_INCREMENT for table `image_processing_talk`
--
ALTER TABLE `image_processing_talk`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `media`
--
ALTER TABLE `media`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `playlist`
--
ALTER TABLE `playlist`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `talk`
--
ALTER TABLE `talk`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `video`
--
ALTER TABLE `video`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `video_category`
--
ALTER TABLE `video_category`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
