/*
  Warnings:

  - A unique constraint covering the columns `[createdAt,id]` on the table `FriendRequest` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "friendsCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "pendingRequestCount" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "FriendRequest_createdAt_id_key" ON "FriendRequest"("createdAt", "id");
