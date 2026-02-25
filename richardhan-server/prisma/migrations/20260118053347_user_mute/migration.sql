/*
  Warnings:

  - You are about to drop the column `blockedUserId` on the `UserBlock` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[blockerId,blockedId]` on the table `UserBlock` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `blockedId` to the `UserBlock` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserBlock" DROP CONSTRAINT "UserBlock_blockedUserId_fkey";

-- DropIndex
DROP INDEX "UserBlock_blockedUserId_idx";

-- DropIndex
DROP INDEX "UserBlock_blockerId_blockedUserId_key";

-- AlterTable
ALTER TABLE "UserBlock" DROP COLUMN "blockedUserId",
ADD COLUMN     "blockedId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "UserMute" (
    "id" TEXT NOT NULL,
    "mutedUserId" TEXT NOT NULL,
    "mutedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserMute_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserMute_mutedUserId_mutedById_key" ON "UserMute"("mutedUserId", "mutedById");

-- CreateIndex
CREATE INDEX "UserBlock_blockedId_idx" ON "UserBlock"("blockedId");

-- CreateIndex
CREATE UNIQUE INDEX "UserBlock_blockerId_blockedId_key" ON "UserBlock"("blockerId", "blockedId");

-- AddForeignKey
ALTER TABLE "UserBlock" ADD CONSTRAINT "UserBlock_blockedId_fkey" FOREIGN KEY ("blockedId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserMute" ADD CONSTRAINT "UserMute_mutedUserId_fkey" FOREIGN KEY ("mutedUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserMute" ADD CONSTRAINT "UserMute_mutedById_fkey" FOREIGN KEY ("mutedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
