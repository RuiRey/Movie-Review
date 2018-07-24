SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


CREATE TABLE `review` (
  `id` int(11) NOT NULL,
  `user` varchar(255) NOT NULL,
  `username` Nvarchar(255) NOT NULL,
  `avatar` varchar(255) NOT NULL,
  `content` varchar(511) CHARACTER SET utf8 DEFAULT NULL,
  `audio` varchar(1023) DEFAULT NULL,
  `duration` int(11) DEFAULT NULL,
  `movie_id` int(11) NOT NULL,
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


ALTER TABLE `review`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `review`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;