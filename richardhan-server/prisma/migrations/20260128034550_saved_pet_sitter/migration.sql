-- CreateTable
CREATE TABLE "SavedPetSitter" (
    "id" TEXT NOT NULL,
    "petSitterId" TEXT NOT NULL,
    "petOwnerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedPetSitter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SavedPetSitter_petOwnerId_idx" ON "SavedPetSitter"("petOwnerId");

-- CreateIndex
CREATE INDEX "SavedPetSitter_petSitterId_idx" ON "SavedPetSitter"("petSitterId");

-- CreateIndex
CREATE UNIQUE INDEX "SavedPetSitter_petSitterId_petOwnerId_key" ON "SavedPetSitter"("petSitterId", "petOwnerId");

-- AddForeignKey
ALTER TABLE "SavedPetSitter" ADD CONSTRAINT "SavedPetSitter_petSitterId_fkey" FOREIGN KEY ("petSitterId") REFERENCES "PetSitterProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedPetSitter" ADD CONSTRAINT "SavedPetSitter_petOwnerId_fkey" FOREIGN KEY ("petOwnerId") REFERENCES "PetOwnerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
