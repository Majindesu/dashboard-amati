-- CreateTable
CREATE TABLE `Office365LinkRequest` (
    `id` VARCHAR(191) NOT NULL,
    `status` ENUM('WAITING', 'ACCEPTED', 'CANCELLED', 'REJECTED') NOT NULL DEFAULT 'WAITING',
    `requestedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `acceptedAt` DATETIME(3) NULL,
    `cancelledAt` DATETIME(3) NULL,
    `rejectedAt` DATETIME(3) NULL,
    `createdBy` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Office365ReferralLink` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `activePeriod` VARCHAR(191) NOT NULL,
    `numberOfUsers` INTEGER NOT NULL,
    `link` VARCHAR(191) NULL,
    `requestId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Office365LinkRequest` ADD CONSTRAINT `Office365LinkRequest_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Office365ReferralLink` ADD CONSTRAINT `Office365ReferralLink_requestId_fkey` FOREIGN KEY (`requestId`) REFERENCES `Office365LinkRequest`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
