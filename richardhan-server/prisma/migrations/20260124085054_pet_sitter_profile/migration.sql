/*
  Warnings:

  - The `status` column on the `PetSitterProfile` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "PetSitterProfile" ADD COLUMN     "profileStatus" "ProfileStatus" NOT NULL DEFAULT 'PENDING',
DROP COLUMN "status",
ADD COLUMN     "status" "PetSitterStatus" NOT NULL DEFAULT 'OFF_SERVICE';
