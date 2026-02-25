/*
  Warnings:

  - You are about to drop the column `commissionRate` on the `PlatformSettingsHistory` table. All the data in the column will be lost.
  - You are about to drop the column `platformFee` on the `PlatformSettingsHistory` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PlatformSettings" ALTER COLUMN "platformFee" SET DEFAULT 10.0;

-- AlterTable
ALTER TABLE "PlatformSettingsHistory" DROP COLUMN "commissionRate",
DROP COLUMN "platformFee",
ADD COLUMN     "commissionRateNew" DECIMAL(65,30),
ADD COLUMN     "commissionRateOld" DECIMAL(65,30),
ADD COLUMN     "platformFeeNew" DECIMAL(65,30),
ADD COLUMN     "platformFeeOld" DECIMAL(65,30);
