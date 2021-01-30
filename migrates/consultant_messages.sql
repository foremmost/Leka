
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

CREATE TABLE `consultant_messages` (
  `id` int(255) NOT NULL,
  `uId` int(255) DEFAULT NULL,
  `source` varchar(20) DEFAULT NULL,
  `dialogId` int(255) NOT NULL,
  `message` text NOT NULL,
  `status` tinyint(5) NOT NULL,
  `addDate` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `consultant_messages`
  ADD PRIMARY KEY (`id`);
ALTER TABLE `consultant_messages`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=482;
COMMIT;
