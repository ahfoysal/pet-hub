/*
  Warnings:

  - You are about to drop the column `animalBreed` on the `PetProfile` table. All the data in the column will be lost.
  - You are about to drop the column `animalType` on the `PetProfile` table. All the data in the column will be lost.
  - You are about to drop the column `medical` on the `PetProfile` table. All the data in the column will be lost.
  - You are about to drop the column `sex` on the `PetProfile` table. All the data in the column will be lost.
  - Added the required column `breed` to the `PetProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `PetProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `petType` to the `PetProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vaccineStatus` to the `PetProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weight` to the `PetProfile` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "VaccinationStatus" AS ENUM ('NOT_VACCINATED', 'PARTIALLY_VACCINATED', 'FULLY_VACCINATED', 'BOOSTER_RECEIVED');

-- AlterTable
ALTER TABLE "PetProfile" DROP COLUMN "animalBreed",
DROP COLUMN "animalType",
DROP COLUMN "medical",
DROP COLUMN "sex",
ADD COLUMN     "breed" TEXT NOT NULL,
ADD COLUMN     "gender" "Gender" NOT NULL,
ADD COLUMN     "healthInfo" TEXT,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastVetVisit" TIMESTAMP(3),
ADD COLUMN     "nextVetVisit" TIMESTAMP(3),
ADD COLUMN     "petType" TEXT NOT NULL,
ADD COLUMN     "recentImages" TEXT[],
ADD COLUMN     "remindNextVetVisit" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "shareMyPetProfile" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "vaccineStatus" "VaccinationStatus" NOT NULL,
ADD COLUMN     "vetDoctorName" TEXT,
ADD COLUMN     "weight" TEXT NOT NULL;
