/*
  Warnings:

  - You are about to drop the column `updatedBy` on the `PlatformSettingsHistory` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "PlatformSettingsHistory" DROP CONSTRAINT "PlatformSettingsHistory_updatedBy_fkey";

-- AlterTable
ALTER TABLE "PlatformSettingsHistory" DROP COLUMN "updatedBy",
ADD COLUMN     "updatedById" TEXT;

-- AlterTable
ALTER TABLE "Variant" ALTER COLUMN "originalPrice" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "sellingPrice" SET DATA TYPE DOUBLE PRECISION;

-- AddForeignKey
ALTER TABLE "PlatformSettingsHistory" ADD CONSTRAINT "PlatformSettingsHistory_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
