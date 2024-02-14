/*
  Warnings:

  - You are about to drop the `UserPhotoProfiles` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `UserPhotoProfiles` DROP FOREIGN KEY `UserPhotoProfiles_userId_fkey`;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `photoProfile` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `UserPhotoProfiles`;
