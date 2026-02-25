/*
  Warnings:

  - You are about to drop the column `organizationId` on the `KYC` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "KYC" DROP CONSTRAINT "KYC_organizationId_fkey";

-- AlterTable
ALTER TABLE "KYC" DROP COLUMN "organizationId";
