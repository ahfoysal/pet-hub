/*
  Warnings:

  - Added the required column `discountType` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DiscountType" AS ENUM ('PERCENTAGE', 'FLAT');

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "discountType" "DiscountType" NOT NULL;
