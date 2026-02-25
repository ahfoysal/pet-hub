/*
  Warnings:

  - Made the column `dateOfBirth` on table `KYC` required. This step will fail if there are existing NULL values in that column.
  - Made the column `gender` on table `KYC` required. This step will fail if there are existing NULL values in that column.
  - Made the column `nationality` on table `KYC` required. This step will fail if there are existing NULL values in that column.
  - Made the column `image` on table `KYC` required. This step will fail if there are existing NULL values in that column.
  - Made the column `identificationNumber` on table `KYC` required. This step will fail if there are existing NULL values in that column.
  - Made the column `identificationFrontImage` on table `KYC` required. This step will fail if there are existing NULL values in that column.
  - Made the column `identificationBackImage` on table `KYC` required. This step will fail if there are existing NULL values in that column.
  - Made the column `signatureImage` on table `KYC` required. This step will fail if there are existing NULL values in that column.
  - Made the column `presentAddress` on table `KYC` required. This step will fail if there are existing NULL values in that column.
  - Made the column `permanentAddress` on table `KYC` required. This step will fail if there are existing NULL values in that column.
  - Made the column `emergencyContactName` on table `KYC` required. This step will fail if there are existing NULL values in that column.
  - Made the column `emergencyContactRelation` on table `KYC` required. This step will fail if there are existing NULL values in that column.
  - Made the column `emergencyContactPhone` on table `KYC` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "HotelProfile" ADD COLUMN     "businessLicense" TEXT,
ADD COLUMN     "businessRegistrationNumber" TEXT,
ADD COLUMN     "insuranceCertificate" TEXT,
ADD COLUMN     "yearsOfExperience" INTEGER DEFAULT 0;

-- AlterTable
ALTER TABLE "KYC" ALTER COLUMN "dateOfBirth" SET NOT NULL,
ALTER COLUMN "gender" SET NOT NULL,
ALTER COLUMN "nationality" SET NOT NULL,
ALTER COLUMN "image" SET NOT NULL,
ALTER COLUMN "identificationNumber" SET NOT NULL,
ALTER COLUMN "identificationFrontImage" SET NOT NULL,
ALTER COLUMN "identificationBackImage" SET NOT NULL,
ALTER COLUMN "signatureImage" SET NOT NULL,
ALTER COLUMN "presentAddress" SET NOT NULL,
ALTER COLUMN "permanentAddress" SET NOT NULL,
ALTER COLUMN "emergencyContactName" SET NOT NULL,
ALTER COLUMN "emergencyContactRelation" SET NOT NULL,
ALTER COLUMN "emergencyContactPhone" SET NOT NULL;

-- AlterTable
ALTER TABLE "PetSitterProfile" ADD COLUMN     "businessLicense" TEXT,
ADD COLUMN     "businessRegistrationNumber" TEXT,
ADD COLUMN     "insuranceCertificate" TEXT;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "seoDescription" TEXT,
ADD COLUMN     "seoTitle" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isTwoFactorEnabled" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Variant" ADD COLUMN     "sku" TEXT;

-- AlterTable
ALTER TABLE "VendorProfile" ADD COLUMN     "businessLicense" TEXT,
ADD COLUMN     "businessRegistrationNumber" TEXT,
ADD COLUMN     "insuranceCertificate" TEXT;

-- CreateTable
CREATE TABLE "HotelNotificationSettings" (
    "id" TEXT NOT NULL,
    "hotelProfileId" TEXT NOT NULL,
    "newBookings" BOOLEAN NOT NULL DEFAULT true,
    "checkInReminders" BOOLEAN NOT NULL DEFAULT true,
    "checkOutReminders" BOOLEAN NOT NULL DEFAULT true,
    "paymentUpdates" BOOLEAN NOT NULL DEFAULT true,
    "adminMessages" BOOLEAN NOT NULL DEFAULT true,
    "bookingCancellations" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HotelNotificationSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PetSitterNotificationSettings" (
    "id" TEXT NOT NULL,
    "petSitterProfileId" TEXT NOT NULL,
    "newBookings" BOOLEAN NOT NULL DEFAULT true,
    "checkInReminders" BOOLEAN NOT NULL DEFAULT true,
    "checkOutReminders" BOOLEAN NOT NULL DEFAULT true,
    "paymentUpdates" BOOLEAN NOT NULL DEFAULT true,
    "adminMessages" BOOLEAN NOT NULL DEFAULT true,
    "bookingCancellations" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PetSitterNotificationSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VendorNotificationSettings" (
    "id" TEXT NOT NULL,
    "vendorProfileId" TEXT NOT NULL,
    "orderConfirmationEmail" BOOLEAN NOT NULL DEFAULT true,
    "orderCancellationEmail" BOOLEAN NOT NULL DEFAULT true,
    "marketingEmail" BOOLEAN NOT NULL DEFAULT false,
    "pushNotifications" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VendorNotificationSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HotelNotificationSettings_hotelProfileId_key" ON "HotelNotificationSettings"("hotelProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "PetSitterNotificationSettings_petSitterProfileId_key" ON "PetSitterNotificationSettings"("petSitterProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "VendorNotificationSettings_vendorProfileId_key" ON "VendorNotificationSettings"("vendorProfileId");

-- AddForeignKey
ALTER TABLE "HotelNotificationSettings" ADD CONSTRAINT "HotelNotificationSettings_hotelProfileId_fkey" FOREIGN KEY ("hotelProfileId") REFERENCES "HotelProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PetSitterNotificationSettings" ADD CONSTRAINT "PetSitterNotificationSettings_petSitterProfileId_fkey" FOREIGN KEY ("petSitterProfileId") REFERENCES "PetSitterProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorNotificationSettings" ADD CONSTRAINT "VendorNotificationSettings_vendorProfileId_fkey" FOREIGN KEY ("vendorProfileId") REFERENCES "VendorProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
