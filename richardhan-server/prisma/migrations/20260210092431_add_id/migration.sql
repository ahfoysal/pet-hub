/*
  Warnings:

  - A unique constraint covering the columns `[packageId]` on the table `Package` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[bookingId]` on the table `PetSitterBooking` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[serviceId]` on the table `Service` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `packageId` to the `Package` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bookingId` to the `PetSitterBooking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serviceId` to the `Service` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Package" ADD COLUMN     "packageId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PetSitterBooking" ADD COLUMN     "bookingId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "serviceId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Package_packageId_key" ON "Package"("packageId");

-- CreateIndex
CREATE UNIQUE INDEX "PetSitterBooking_bookingId_key" ON "PetSitterBooking"("bookingId");

-- CreateIndex
CREATE UNIQUE INDEX "Service_serviceId_key" ON "Service"("serviceId");
