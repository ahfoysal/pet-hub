-- AlterTable
ALTER TABLE "PetSitterBooking" ADD COLUMN     "additionalServicesIds" TEXT[],
ADD COLUMN     "durationInMinutes" INTEGER,
ADD COLUMN     "specialInstructions" TEXT;

-- CreateTable
CREATE TABLE "PetSitterBookingAdditionalService" (
    "petSitterBookingId" TEXT NOT NULL,
    "additionalServiceId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "PetSitterBookingAdditionalService_petSitterBookingId_additi_key" ON "PetSitterBookingAdditionalService"("petSitterBookingId", "additionalServiceId");

-- AddForeignKey
ALTER TABLE "PetSitterBookingAdditionalService" ADD CONSTRAINT "PetSitterBookingAdditionalService_petSitterBookingId_fkey" FOREIGN KEY ("petSitterBookingId") REFERENCES "PetSitterBooking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PetSitterBookingAdditionalService" ADD CONSTRAINT "PetSitterBookingAdditionalService_additionalServiceId_fkey" FOREIGN KEY ("additionalServiceId") REFERENCES "AddOn"("id") ON DELETE CASCADE ON UPDATE CASCADE;
