-- AlterEnum
ALTER TYPE "PetSitterBookingStatus" ADD VALUE 'LATE';

-- AlterTable
ALTER TABLE "PetSitterBooking" ADD COLUMN     "isLate" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "minutesLate" INTEGER DEFAULT 0;
