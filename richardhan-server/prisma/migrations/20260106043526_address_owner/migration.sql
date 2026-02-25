-- AlterTable
ALTER TABLE "ShippingAddress" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "isDefault" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "ShippingAddress_userId_idx" ON "ShippingAddress"("userId");
