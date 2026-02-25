/*
  Warnings:

  - A unique constraint covering the columns `[userId,reelId,bookMarkType]` on the table `Bookmark` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,postId,bookMarkType]` on the table `Bookmark` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Bookmark" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "Bookmark_userId_bookMarkType_createdAt_idx" ON "Bookmark"("userId", "bookMarkType", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Bookmark_userId_reelId_bookMarkType_key" ON "Bookmark"("userId", "reelId", "bookMarkType");

-- CreateIndex
CREATE UNIQUE INDEX "Bookmark_userId_postId_bookMarkType_key" ON "Bookmark"("userId", "postId", "bookMarkType");
