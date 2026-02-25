/*
  Warnings:

  - You are about to drop the column `address` on the `PetOwnerProfile` table. All the data in the column will be lost.
  - Added the required column `addressId` to the `PetOwnerProfile` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Organization" DROP CONSTRAINT "Organization_addressId_fkey";

-- DropForeignKey
ALTER TABLE "PetSitterProfile" DROP CONSTRAINT "PetSitterProfile_addressId_fkey";

-- AlterTable
ALTER TABLE "PetOwnerProfile" DROP COLUMN "address",
ADD COLUMN     "addressId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PetSitterProfile" ADD CONSTRAINT "PetSitterProfile_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PetOwnerProfile" ADD CONSTRAINT "PetOwnerProfile_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE CASCADE ON UPDATE CASCADE;
