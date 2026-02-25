/*
  Warnings:

  - You are about to drop the column `yeasOfExperience` on the `PetSitterProfile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PetSitterProfile" DROP COLUMN "yeasOfExperience",
ADD COLUMN     "yearsOfExperience" INTEGER NOT NULL DEFAULT 0;
