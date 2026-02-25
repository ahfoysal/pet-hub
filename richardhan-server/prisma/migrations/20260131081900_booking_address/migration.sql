-- DropForeignKey
ALTER TABLE "PetSitterBooking" DROP CONSTRAINT "PetSitterBooking_clientId_fkey";

-- DropForeignKey
ALTER TABLE "PetSitterBooking" DROP CONSTRAINT "PetSitterBooking_packageId_fkey";

-- DropForeignKey
ALTER TABLE "PetSitterBooking" DROP CONSTRAINT "PetSitterBooking_petSitterProfileId_fkey";

-- DropForeignKey
ALTER TABLE "PetSitterBooking" DROP CONSTRAINT "PetSitterBooking_serviceId_fkey";

-- DropForeignKey
ALTER TABLE "PetSitterBookingPet" DROP CONSTRAINT "PetSitterBookingPet_petId_fkey";

-- DropForeignKey
ALTER TABLE "PetSitterBookingPet" DROP CONSTRAINT "PetSitterBookingPet_petSitterBookingId_fkey";

-- AlterTable
ALTER TABLE "PetSitterBooking" ADD COLUMN     "isOwnHome" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "location" TEXT NOT NULL DEFAULT '';

-- AddForeignKey
ALTER TABLE "PetSitterBooking" ADD CONSTRAINT "PetSitterBooking_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PetSitterBooking" ADD CONSTRAINT "PetSitterBooking_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PetSitterBooking" ADD CONSTRAINT "PetSitterBooking_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PetSitterBooking" ADD CONSTRAINT "PetSitterBooking_petSitterProfileId_fkey" FOREIGN KEY ("petSitterProfileId") REFERENCES "PetSitterProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PetSitterBookingPet" ADD CONSTRAINT "PetSitterBookingPet_petSitterBookingId_fkey" FOREIGN KEY ("petSitterBookingId") REFERENCES "PetSitterBooking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PetSitterBookingPet" ADD CONSTRAINT "PetSitterBookingPet_petId_fkey" FOREIGN KEY ("petId") REFERENCES "PetProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
