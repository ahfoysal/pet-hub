-- DropForeignKey
ALTER TABLE "PetSitterBookingAdditionalService" DROP CONSTRAINT "PetSitterBookingAdditionalService_additionalServiceId_fkey";

-- AddForeignKey
ALTER TABLE "PetSitterBookingAdditionalService" ADD CONSTRAINT "PetSitterBookingAdditionalService_additionalServiceId_fkey" FOREIGN KEY ("additionalServiceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;
