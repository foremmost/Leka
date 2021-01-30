SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

CREATE TABLE `consultant_chats` (
  `id` int(255) NOT NULL,
  `uId` int(255) NOT NULL,
  `answerUid` int(255) NOT NULL,
  `status` tinyint(4) NOT NULL,
  `source` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `consultant_chats`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `consultant_chats`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=86;
COMMIT;