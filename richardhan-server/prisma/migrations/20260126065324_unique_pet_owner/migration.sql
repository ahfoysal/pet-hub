/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `PetOwnerProfile` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "PetSitterProfile" ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "PetOwnerProfile_userId_key" ON "PetOwnerProfile"("userId");
