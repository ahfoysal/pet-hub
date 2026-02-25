/*
  Warnings:

  - You are about to drop the column `vendorId` on the `Cart` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Cart" DROP CONSTRAINT "Cart_vendorId_fkey";

-- AlterTable
ALTER TABLE "Cart" DROP COLUMN "vendorId";
