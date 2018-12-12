-- phpMyAdmin SQL Dump
-- version 4.8.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 12, 2018 at 10:02 AM
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
-- Database: `geopictures`
--

-- --------------------------------------------------------

--
-- Table structure for table `abstract`
--

CREATE TABLE `abstract` (
  `id` int(10) UNSIGNED NOT NULL,
  `image_path` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `abstract`
--

INSERT INTO `abstract` (`id`, `image_path`) VALUES
(1, 'Abstract/Abstract_1.png'),
(2, 'Abstract/Abstract_2.png'),
(3, 'Abstract/Abstract_3.png'),
(4, 'Abstract/Abstract_4.png'),
(5, 'Abstract/Abstract_5.png'),
(6, 'Abstract/Abstract_6.png'),
(7, 'Abstract/Abstract_7.png'),
(8, 'Abstract/Abstract_8.png'),
(9, 'Abstract/Abstract_9.png'),
(10, 'Abstract/Abstract_10.png');

-- --------------------------------------------------------

--
-- Table structure for table `nigeria`
--

CREATE TABLE `nigeria` (
  `id` int(10) UNSIGNED NOT NULL,
  `image_path` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `nigeria`
--

INSERT INTO `nigeria` (`id`, `image_path`) VALUES
(1, 'Nigeria/Nigeria_1.png'),
(2, 'Nigeria/Nigeria_2.png'),
(3, 'Nigeria/Nigeria_3.png'),
(4, 'Nigeria/Nigeria_4.png'),
(5, 'Nigeria/Nigeria_5.png'),
(6, 'Nigeria/Nigeria_6.png'),
(7, 'Nigeria/Nigeria_7.png'),
(8, 'Nigeria/Nigeria_8.png'),
(9, 'Nigeria/Nigeria_9.png'),
(10, 'Nigeria/Nigeria_10.png'),
(11, 'Nigeria/Nigeria_11.png'),
(12, 'Nigeria/Nigeria_12.png'),
(13, 'Nigeria/Nigeria_13.png'),
(14, 'Nigeria/Nigeria_14.png');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `abstract`
--
ALTER TABLE `abstract`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `nigeria`
--
ALTER TABLE `nigeria`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `abstract`
--
ALTER TABLE `abstract`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `nigeria`
--
ALTER TABLE `nigeria`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
