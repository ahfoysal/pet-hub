-- CreateTable
CREATE TABLE "PetSitterReview" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "petSitterId" TEXT NOT NULL,

    CONSTRAINT "PetSitterReview_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PetSitterReview_petSitterId_idx" ON "PetSitterReview"("petSitterId");

-- CreateIndex
CREATE INDEX "PetSitterReview_userId_idx" ON "PetSitterReview"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PetSitterReview_petSitterId_userId_key" ON "PetSitterReview"("petSitterId", "userId");

-- AddForeignKey
ALTER TABLE "PetSitterReview" ADD CONSTRAINT "PetSitterReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PetSitterReview" ADD CONSTRAINT "PetSitterReview_petSitterId_fkey" FOREIGN KEY ("petSitterId") REFERENCES "PetSitterProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
