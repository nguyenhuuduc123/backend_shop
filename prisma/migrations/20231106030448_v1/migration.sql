/*
  Warnings:

  - You are about to drop the column `isClothing` on the `category` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `category` DROP COLUMN `isClothing`,
    ADD COLUMN `isPhone` BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE `SmartPhoneDetail` (
    `productDetailId` INTEGER NOT NULL AUTO_INCREMENT,
    `resolution` VARCHAR(191) NULL,
    `wideScreen` VARCHAR(191) NULL,
    `rearCameraResolution` VARCHAR(191) NULL,
    `frontCameraResolution` VARCHAR(191) NULL,
    `operatingSystem` VARCHAR(191) NULL,
    `processorChip` VARCHAR(191) NULL,
    `ram` INTEGER NULL,
    `rom` INTEGER NULL,
    `sim` VARCHAR(191) NULL,
    `batteryCapacity` VARCHAR(191) NULL,
    `batteryType` VARCHAR(191) NULL,
    `camera` INTEGER NULL,

    PRIMARY KEY (`productDetailId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
