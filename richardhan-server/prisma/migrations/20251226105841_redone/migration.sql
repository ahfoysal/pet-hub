/*
  Warnings:

  - You are about to drop the column `organizationId` on the `HotelProfile` table. All the data in the column will be lost.
  - You are about to drop the column `organizationId` on the `PetSchoolProfile` table. All the data in the column will be lost.
  - You are about to drop the column `organizationId` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `organizationId` on the `VendorProfile` table. All the data in the column will be lost.
  - You are about to drop the `Organization` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OrganizationAddress` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId]` on the table `HotelProfile` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `PetSchoolProfile` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[reviewerId,profileId]` on the table `Review` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `HotelProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `HotelProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `HotelProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `HotelProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `PetSchoolProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `PetSchoolProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `PetSchoolProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profileId` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profileType` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `VendorProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `VendorProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `VendorProfile` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "VendorStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'PENDING', 'BLOCKED');

-- CreateEnum
CREATE TYPE "ReviewTargetType" AS ENUM ('VENDOR', 'HOTEL', 'PETSCHOOL', 'PETSITTER');

-- DropForeignKey
ALTER TABLE "HotelProfile" DROP CONSTRAINT "HotelProfile_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Organization" DROP CONSTRAINT "Organization_userId_fkey";

-- DropForeignKey
ALTER TABLE "OrganizationAddress" DROP CONSTRAINT "OrganizationAddress_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "PetSchoolProfile" DROP CONSTRAINT "PetSchoolProfile_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "PetSchoolProfile" DROP CONSTRAINT "PetSchoolProfile_userId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "VendorProfile" DROP CONSTRAINT "VendorProfile_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "VendorProfile" DROP CONSTRAINT "VendorProfile_userId_fkey";

-- DropIndex
DROP INDEX "HotelProfile_organizationId_key";

-- DropIndex
DROP INDEX "PetSchoolProfile_organizationId_key";

-- DropIndex
DROP INDEX "PetSchoolProfile_userId_idx";

-- DropIndex
DROP INDEX "VendorProfile_organizationId_key";

-- AlterTable
ALTER TABLE "HotelProfile" DROP COLUMN "organizationId",
ADD COLUMN     "analytics" JSONB,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "images" TEXT[],
ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "reviewCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PetSchoolProfile" DROP COLUMN "organizationId",
ADD COLUMN     "analytics" JSONB,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "images" TEXT[],
ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "reviewCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "organizationId",
ADD COLUMN     "profileId" TEXT NOT NULL,
ADD COLUMN     "profileType" "ReviewTargetType" NOT NULL;

-- AlterTable
ALTER TABLE "VendorProfile" DROP COLUMN "organizationId",
ADD COLUMN     "analytics" JSONB,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "images" TEXT[],
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "reviewCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "status" "VendorStatus" NOT NULL DEFAULT 'PENDING';

-- DropTable
DROP TABLE "Organization";

-- DropTable
DROP TABLE "OrganizationAddress";

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "vendorProfileId" TEXT,
    "hotelProfileId" TEXT,
    "petSchoolProfileId" TEXT,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HotelProfile_userId_key" ON "HotelProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PetSchoolProfile_userId_key" ON "PetSchoolProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Review_reviewerId_profileId_key" ON "Review"("reviewerId", "profileId");

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_vendorProfileId_fkey" FOREIGN KEY ("vendorProfileId") REFERENCES "VendorProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_hotelProfileId_fkey" FOREIGN KEY ("hotelProfileId") REFERENCES "HotelProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_petSchoolProfileId_fkey" FOREIGN KEY ("petSchoolProfileId") REFERENCES "PetSchoolProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HotelProfile" ADD CONSTRAINT "HotelProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorProfile" ADD CONSTRAINT "VendorProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PetSchoolProfile" ADD CONSTRAINT "PetSchoolProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
