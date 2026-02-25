/*
  Warnings:

  - You are about to drop the column `details` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `street` on the `Address` table. All the data in the column will be lost.
  - Added the required column `streetAddress` to the `Address` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Address" DROP COLUMN "details",
DROP COLUMN "street",
ADD COLUMN     "streetAddress" TEXT NOT NULL;
