/*
  Warnings:

  - You are about to drop the column `healthInfo` on the `PetProfile` table. All the data in the column will be lost.
  - You are about to drop the column `lastVetVisit` on the `PetProfile` table. All the data in the column will be lost.
  - You are about to drop the column `nextVetVisit` on the `PetProfile` table. All the data in the column will be lost.
  - You are about to drop the column `qrCode` on the `PetProfile` table. All the data in the column will be lost.
  - You are about to drop the column `remindNextVetVisit` on the `PetProfile` table. All the data in the column will be lost.
  - You are about to drop the column `shareMyPetProfile` on the `PetProfile` table. All the data in the column will be lost.
  - You are about to drop the column `vaccineStatus` on the `PetProfile` table. All the data in the column will be lost.
  - Made the column `vetDoctorName` on table `PetProfile` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "VaccineStatus" AS ENUM ('UPDATED', 'NOT_UPDATED', 'DUE');

-- AlterTable
ALTER TABLE "PetProfile" DROP COLUMN "healthInfo",
DROP COLUMN "lastVetVisit",
DROP COLUMN "nextVetVisit",
DROP COLUMN "qrCode",
DROP COLUMN "remindNextVetVisit",
DROP COLUMN "shareMyPetProfile",
DROP COLUMN "vaccineStatus",
ADD COLUMN     "allergies" TEXT,
ADD COLUMN     "bordetellaStatus" "VaccineStatus" NOT NULL DEFAULT 'DUE',
ADD COLUMN     "color" TEXT NOT NULL DEFAULT 'Unknown',
ADD COLUMN     "dateOfBirth" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "dhppStatus" "VaccineStatus" NOT NULL DEFAULT 'DUE',
ADD COLUMN     "feedingInstructions" TEXT NOT NULL DEFAULT 'No instructions',
ADD COLUMN     "isGoodWithKids" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isGoodWithOtherPets" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "microChipId" TEXT,
ADD COLUMN     "rabiesStatus" "VaccineStatus" NOT NULL DEFAULT 'DUE',
ADD COLUMN     "specialNotes" TEXT,
ADD COLUMN     "temperament" TEXT NOT NULL DEFAULT 'Unknown',
ADD COLUMN     "vetDoctorPhone" TEXT NOT NULL DEFAULT 'N/A',
ALTER COLUMN "recentImages" SET DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "vetDoctorName" SET NOT NULL,
ALTER COLUMN "vetDoctorName" SET DEFAULT 'Not Assigned';
