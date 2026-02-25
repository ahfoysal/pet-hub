/*
  Warnings:

  - You are about to drop the column `media` on the `Moment` table. All the data in the column will be lost.
  - You are about to drop the column `mediaType` on the `Story` table. All the data in the column will be lost.
  - Added the required column `visibility` to the `Story` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Visibility" AS ENUM ('PUBLIC', 'PRIVATE', 'FRIENDS');

-- DropForeignKey
ALTER TABLE "Moment" DROP CONSTRAINT "Moment_userId_fkey";

-- AlterTable
ALTER TABLE "Moment" DROP COLUMN "media",
ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Story" DROP COLUMN "mediaType",
ADD COLUMN     "isPublished" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "viewCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "visibility" "Visibility" NOT NULL;

-- CreateIndex
CREATE INDEX "Story_isPublished_expiresAt_idx" ON "Story"("isPublished", "expiresAt");

-- CreateIndex
CREATE INDEX "Story_userId_idx" ON "Story"("userId");

-- AddForeignKey
ALTER TABLE "Moment" ADD CONSTRAINT "Moment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
