-- AlterTable
ALTER TABLE "PetSitterBooking" ADD COLUMN     "cancelledAt" TIMESTAMP(3),
ADD COLUMN     "cancelledByRole" "ProfileType",
ADD COLUMN     "cancelledByUserId" TEXT;

-- AddForeignKey
ALTER TABLE "PetSitterBooking" ADD CONSTRAINT "PetSitterBooking_cancelledByUserId_fkey" FOREIGN KEY ("cancelledByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
