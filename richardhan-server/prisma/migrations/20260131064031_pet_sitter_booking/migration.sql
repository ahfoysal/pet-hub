/*
  Warnings:

  - You are about to drop the column `addOns` on the `PetSitterBooking` table. All the data in the column will be lost.
  - You are about to drop the column `bookingTime` on the `PetSitterBooking` table. All the data in the column will be lost.
  - You are about to drop the column `feeType` on the `PetSitterBooking` table. All the data in the column will be lost.
  - You are about to drop the column `petIds` on the `PetSitterBooking` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `PetSitterBooking` table. All the data in the column will be lost.
  - Added the required column `bookingType` to the `PetSitterBooking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clientId` to the `PetSitterBooking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startingTime` to the `PetSitterBooking` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BookingType" AS ENUM ('Package', 'Service');

-- CreateEnum
CREATE TYPE "PetSitterBookingStatus" AS ENUM ('Pending', 'Confirmed', 'InProgress', 'Completed', 'Cancelled');

-- DropForeignKey
ALTER TABLE "PetSitterBooking" DROP CONSTRAINT "PetSitterBooking_userId_fkey";

-- AlterTable
ALTER TABLE "PetSitterBooking" DROP COLUMN "addOns",
DROP COLUMN "bookingTime",
DROP COLUMN "feeType",
DROP COLUMN "petIds",
DROP COLUMN "userId",
ADD COLUMN     "bookingType" "BookingType" NOT NULL,
ADD COLUMN     "clientId" TEXT NOT NULL,
ADD COLUMN     "packageId" TEXT,
ADD COLUMN     "serviceId" TEXT,
ADD COLUMN     "startingTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "status" "PetSitterBookingStatus" NOT NULL DEFAULT 'Pending',
ALTER COLUMN "finishingTime" DROP NOT NULL,
ALTER COLUMN "paymentId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "PetSitterBookingPet" (
    "petSitterBookingId" TEXT NOT NULL,
    "petId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "PetSitterBookingPet_petSitterBookingId_petId_key" ON "PetSitterBookingPet"("petSitterBookingId", "petId");

-- AddForeignKey
ALTER TABLE "PetSitterBooking" ADD CONSTRAINT "PetSitterBooking_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PetSitterBooking" ADD CONSTRAINT "PetSitterBooking_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PetSitterBooking" ADD CONSTRAINT "PetSitterBooking_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PetSitterBookingPet" ADD CONSTRAINT "PetSitterBookingPet_petSitterBookingId_fkey" FOREIGN KEY ("petSitterBookingId") REFERENCES "PetSitterBooking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PetSitterBookingPet" ADD CONSTRAINT "PetSitterBookingPet_petId_fkey" FOREIGN KEY ("petId") REFERENCES "PetProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
