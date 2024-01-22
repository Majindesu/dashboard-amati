/*
  Warnings:

  - You are about to drop the column `image` on the `User` table. All the data in the column will be lost.
  - Added the required column `path` to the `UserPhotoProfiles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `image`;

-- AlterTable
ALTER TABLE `UserPhotoProfiles` ADD COLUMN `path` VARCHAR(191) NOT NULL;
