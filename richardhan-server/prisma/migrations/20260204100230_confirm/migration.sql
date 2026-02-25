-- AlterEnum
ALTER TYPE "PetSitterBookingStatus" ADD VALUE 'EXPIRED';

-- AlterTable
ALTER TABLE "PetSitterBooking" ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "completionNote" TEXT,
ADD COLUMN     "completionProof" TEXT[],
ADD COLUMN     "requestCompletedAt" TIMESTAMP(3);
