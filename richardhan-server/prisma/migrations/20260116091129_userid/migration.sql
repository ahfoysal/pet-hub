/*
  Warnings:

  - You are about to drop the column `blockedId` on the `UserBlock` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[blockerId,blockedUserId]` on the table `UserBlock` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `blockedUserId` to the `UserBlock` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserBlock" DROP CONSTRAINT "UserBlock_blockedId_fkey";

-- DropIndex
DROP INDEX "UserBlock_blockedId_idx";

-- DropIndex
DROP INDEX "UserBlock_blockerId_blockedId_key";

-- AlterTable
ALTER TABLE "UserBlock" DROP COLUMN "blockedId",
ADD COLUMN     "blockedUserId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "UserBlock_blockedUserId_idx" ON "UserBlock"("blockedUserId");

-- CreateIndex
CREATE UNIQUE INDEX "UserBlock_blockerId_blockedUserId_key" ON "UserBlock"("blockerId", "blockedUserId");

-- AddForeignKey
ALTER TABLE "UserBlock" ADD CONSTRAINT "UserBlock_blockedUserId_fkey" FOREIGN KEY ("blockedUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
