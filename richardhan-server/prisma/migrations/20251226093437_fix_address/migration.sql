/*
  Warnings:

  - You are about to drop the column `addressId` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `addressId` on the `PetOwnerProfile` table. All the data in the column will be lost.
  - You are about to drop the column `addressId` on the `PetSitterProfile` table. All the data in the column will be lost.
  - You are about to drop the `Address` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Address" DROP CONSTRAINT "Address_userId_fkey";

-- DropForeignKey
ALTER TABLE "Organization" DROP CONSTRAINT "Organization_addressId_fkey";

-- DropForeignKey
ALTER TABLE "PetOwnerProfile" DROP CONSTRAINT "PetOwnerProfile_addressId_fkey";

-- DropForeignKey
ALTER TABLE "PetSitterProfile" DROP CONSTRAINT "PetSitterProfile_addressId_fkey";

-- AlterTable
ALTER TABLE "Organization" DROP COLUMN "addressId";

-- AlterTable
ALTER TABLE "PetOwnerProfile" DROP COLUMN "addressId";

-- AlterTable
ALTER TABLE "PetSitterProfile" DROP COLUMN "addressId";

-- DropTable
DROP TABLE "Address";

-- CreateTable
CREATE TABLE "OrganizationAddress" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "streetAddress" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrganizationAddress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PetOwnerAddress" (
    "id" TEXT NOT NULL,
    "petOwnerId" TEXT NOT NULL,
    "streetAddress" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PetOwnerAddress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PetSitterAddress" (
    "id" TEXT NOT NULL,
    "petSitterId" TEXT NOT NULL,
    "streetAddress" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PetSitterAddress_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OrganizationAddress" ADD CONSTRAINT "OrganizationAddress_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PetOwnerAddress" ADD CONSTRAINT "PetOwnerAddress_petOwnerId_fkey" FOREIGN KEY ("petOwnerId") REFERENCES "PetOwnerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PetSitterAddress" ADD CONSTRAINT "PetSitterAddress_petSitterId_fkey" FOREIGN KEY ("petSitterId") REFERENCES "PetSitterProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
