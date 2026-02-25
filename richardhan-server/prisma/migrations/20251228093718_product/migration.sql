/*
  Warnings:

  - You are about to drop the column `isBestSelling` on the `Product` table. All the data in the column will be lost.
  - Added the required column `stock` to the `Variant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "isBestSelling",
ALTER COLUMN "inStock" SET DEFAULT true,
ALTER COLUMN "isPublish" SET DEFAULT true,
ALTER COLUMN "avgRating" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "Variant" ADD COLUMN     "stock" INTEGER NOT NULL;
