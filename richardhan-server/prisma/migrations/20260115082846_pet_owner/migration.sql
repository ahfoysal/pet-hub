-- DropForeignKey
ALTER TABLE "PetOwnerProfile" DROP CONSTRAINT "PetOwnerProfile_bankingInfo_fkey";

-- AlterTable
ALTER TABLE "PetOwnerProfile" ALTER COLUMN "bankingInfo" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "PetOwnerProfile" ADD CONSTRAINT "PetOwnerProfile_bankingInfo_fkey" FOREIGN KEY ("bankingInfo") REFERENCES "BankInformation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
