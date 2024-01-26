-- AlterTable
ALTER TABLE `Permission` ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `Role` ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT false;
