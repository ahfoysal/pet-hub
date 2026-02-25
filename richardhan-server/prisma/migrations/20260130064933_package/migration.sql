/*
  Warnings:

  - You are about to drop the column `breed` on the `Package` table. All the data in the column will be lost.
  - You are about to drop the column `details` on the `Package` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `Package` table. All the data in the column will be lost.
  - You are about to drop the column `isHomeService` on the `Package` table. All the data in the column will be lost.
  - You are about to drop the column `petCategory` on the `Package` table. All the data in the column will be lost.
  - You are about to drop the column `petCount` on the `Package` table. All the data in the column will be lost.
  - You are about to drop the column `petSubCategory` on the `Package` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Package` table. All the data in the column will be lost.
  - You are about to drop the column `profileId` on the `Package` table. All the data in the column will be lost.
  - The primary key for the `PackageService` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `PackageService` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `PackageService` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `PackageService` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[packageId,serviceId]` on the table `PackageService` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `description` to the `Package` table without a default value. This is not possible if the table is not empty.
  - Added the required column `durationInMinutes` to the `Package` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `Package` table without a default value. This is not possible if the table is not empty.
  - Added the required column `offeredPrice` to the `Package` table without a default value. This is not possible if the table is not empty.
  - Added the required column `petSitterId` to the `Package` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Package" DROP CONSTRAINT "Package_profileId_fkey";

-- DropForeignKey
ALTER TABLE "PackageService" DROP CONSTRAINT "PackageService_packageId_fkey";

-- DropForeignKey
ALTER TABLE "PackageService" DROP CONSTRAINT "PackageService_serviceId_fkey";

-- AlterTable
ALTER TABLE "Package" DROP COLUMN "breed",
DROP COLUMN "details",
DROP COLUMN "duration",
DROP COLUMN "isHomeService",
DROP COLUMN "petCategory",
DROP COLUMN "petCount",
DROP COLUMN "petSubCategory",
DROP COLUMN "price",
DROP COLUMN "profileId",
ADD COLUMN     "calculatedPrice" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "durationInMinutes" INTEGER NOT NULL,
ADD COLUMN     "image" TEXT NOT NULL,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "offeredPrice" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "petSitterId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PackageService" DROP CONSTRAINT "PackageService_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "id",
DROP COLUMN "updatedAt";

-- CreateTable
CREATE TABLE "AddOnPackage" (
    "AddOnId" TEXT NOT NULL,
    "PackageId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "AddOnPackage_AddOnId_PackageId_key" ON "AddOnPackage"("AddOnId", "PackageId");

-- CreateIndex
CREATE UNIQUE INDEX "PackageService_packageId_serviceId_key" ON "PackageService"("packageId", "serviceId");

-- AddForeignKey
ALTER TABLE "Package" ADD CONSTRAINT "Package_petSitterId_fkey" FOREIGN KEY ("petSitterId") REFERENCES "PetSitterProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageService" ADD CONSTRAINT "PackageService_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageService" ADD CONSTRAINT "PackageService_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AddOnPackage" ADD CONSTRAINT "AddOnPackage_AddOnId_fkey" FOREIGN KEY ("AddOnId") REFERENCES "AddOn"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AddOnPackage" ADD CONSTRAINT "AddOnPackage_PackageId_fkey" FOREIGN KEY ("PackageId") REFERENCES "Package"("id") ON DELETE CASCADE ON UPDATE CASCADE;
