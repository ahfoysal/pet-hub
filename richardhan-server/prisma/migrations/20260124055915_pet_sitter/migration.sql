/*
  Warnings:

  - Added the required column `designations` to the `PetSitterProfile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PetSitterProfile" ADD COLUMN     "designations" TEXT NOT NULL,
ADD COLUMN     "languages" TEXT[],
ADD COLUMN     "yeasOfExperience" INTEGER NOT NULL DEFAULT 0;
