SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE TABLE `captcha` (
  `guildID` varchar(255) PRIMARY KEY NOT NULL,
  `guildName` text(255) NOT NULL,
  `channelID` varchar(255),
  `channelName` text(255),
  `roleID` varchar(255),
  `roleName` text(255),
  `timeCaptcha` varchar(255) DEFAULT '2m' NOT NULL,
  `longueurCaptcha` int(255) DEFAULT 6 NOT NULL,
  `isCaptcha` boolean DEFAULT 0 NOT NULL
) ENGINE=InnoDB DEFAULT charset=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `antiRaid` (
  `guildID` varchar(255) PRIMARY KEY NOT NULL,
  `guildName` text(255) NOT NULL,
  `isAntiRaid` boolean DEFAULT 0 NOT NULL
) ENGINE=InnoDB DEFAULT charset=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `pick` (
  `guildID` varchar(255) PRIMARY KEY NOT NULL,
  `guildName` text(255) NOT NULL,
  `pickChannelID` varchar(255),
  `pickChannelName` text(255),
  `roleCanPickID` varchar(255),
  `roleCanPickName` text(255),
  `rolePicksID` varchar(255),
  `rolePicksName` text(255),
  `partieID` text(255),
  `partieName` text(255),
  `nombreMessages` int(255) DEFAULT 0 NOT NULL
) ENGINE=InnoDB DEFAULT charset=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `notifChannel` (
  `guildID` varchar(255) PRIMARY KEY NOT NULL,
  `guildName` text(255) NOT NULL,
  `notifChannelID` varchar(255),
  `notifChannelName` text(255)
) ENGINE=InnoDB DEFAULT charset=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `blacklist` (
  `guildID` varchar(255) NOT NULL,
  `guildName` text(255) NOT NULL,
  `blacklisterUserID` varchar(255) NOT NULL,
  `blacklisterUserName` text(255) NOT NULL,
  `userID` varchar(255),
  `userName` text(255),
  `pseudoMc` text(255),
  `raison` text(255) NOT NULL
) ENGINE=InnoDB DEFAULT charset=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `warn` (
  `guildID` varchar(255) NOT NULL,
  `guildName` text NOT NULL,
  `userID` varchar(255) NOT NULL,
  `userName` text NOT NULL,
  `authorID` varchar(255) NOT NULL,
  `warnID` varchar(255) PRIMARY KEY NOT NULL,
  `raison` varchar(2000) NOT NULL,
  `date` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `xp` (
  `ID` varchar(255) PRIMARY KEY NOT NULL,
  `guildID` varchar(255) NOT NULL,
  `guildName` text NOT NULL,
  `userID` varchar(255) NOT NULL,
  `userName` text NOT NULL,
  `xp` int(255) NOT NULL,
  `level` int(255) NOT NULL,
  `URLClassement` varchar(255) DEFAULT 'Ressources/classementBackground.jpg' NOT NULL,
  `URLClassementPerso` varchar(255) DEFAULT 'Ressources/classementBackground.jpg' NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

COMMIT;
