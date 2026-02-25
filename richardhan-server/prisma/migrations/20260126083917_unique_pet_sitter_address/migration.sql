/*
  Warnings:

  - A unique constraint covering the columns `[petSitterId]` on the table `PetSitterAddress` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PetSitterAddress_petSitterId_key" ON "PetSitterAddress"("petSitterId");
