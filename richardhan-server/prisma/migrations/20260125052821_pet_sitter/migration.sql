/*
  Warnings:

  - You are about to drop the column `profileId` on the `Service` table. All the data in the column will be lost.
  - Added the required column `durationInMinutes` to the `Service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `petSitterId` to the `Service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thumbnailImage` to the `Service` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Service" DROP CONSTRAINT "Service_profileId_fkey";

-- AlterTable
ALTER TABLE "Service" DROP COLUMN "profileId",
ADD COLUMN     "discount" INTEGER,
ADD COLUMN     "durationInMinutes" INTEGER NOT NULL,
ADD COLUMN     "isAvailable" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isDiscountable" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "petSitterId" TEXT NOT NULL,
ADD COLUMN     "tags" TEXT[],
ADD COLUMN     "thumbnailImage" TEXT NOT NULL,
ADD COLUMN     "whatsIncluded" TEXT[];

-- CreateIndex
CREATE INDEX "Service_petSitterId_idx" ON "Service"("petSitterId");

-- CreateIndex
CREATE INDEX "Service_name_idx" ON "Service"("name");

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_petSitterId_fkey" FOREIGN KEY ("petSitterId") REFERENCES "PetSitterProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
