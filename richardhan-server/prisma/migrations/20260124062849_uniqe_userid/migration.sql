/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `PetSitterProfile` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PetSitterProfile_userId_key" ON "PetSitterProfile"("userId");
