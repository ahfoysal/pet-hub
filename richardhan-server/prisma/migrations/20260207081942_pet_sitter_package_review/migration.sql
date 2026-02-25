-- CreateTable
CREATE TABLE "PetSitterPackageReview" (
    "id" TEXT NOT NULL,
    "packageId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "PetSitterPackageReview_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PetSitterPackageReview_packageId_idx" ON "PetSitterPackageReview"("packageId");

-- CreateIndex
CREATE INDEX "PetSitterPackageReview_userId_idx" ON "PetSitterPackageReview"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PetSitterPackageReview_packageId_userId_key" ON "PetSitterPackageReview"("packageId", "userId");

-- AddForeignKey
ALTER TABLE "PetSitterPackageReview" ADD CONSTRAINT "PetSitterPackageReview_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PetSitterPackageReview" ADD CONSTRAINT "PetSitterPackageReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
