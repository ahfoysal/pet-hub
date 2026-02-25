-- DropForeignKey
ALTER TABLE "PetSitterProfile" DROP CONSTRAINT "PetSitterProfile_userId_fkey";

-- AddForeignKey
ALTER TABLE "PetSitterProfile" ADD CONSTRAINT "PetSitterProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
