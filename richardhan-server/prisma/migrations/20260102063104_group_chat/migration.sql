/*
  Warnings:

  - You are about to drop the column `userId` on the `CommunityMessage` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[lastMessageId]` on the table `CommunityTopic` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `senderId` to the `CommunityMessage` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CommunityMessageType" AS ENUM ('USER_MESSAGE', 'ACTION_MESSAGE');

-- DropForeignKey
ALTER TABLE "CommunityMessage" DROP CONSTRAINT "CommunityMessage_userId_fkey";

-- AlterTable
ALTER TABLE "CommunityMessage" DROP COLUMN "userId",
ADD COLUMN     "messageType" "CommunityMessageType" NOT NULL DEFAULT 'USER_MESSAGE',
ADD COLUMN     "senderId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "CommunityTopic" ADD COLUMN     "lastMessageId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "CommunityTopic_lastMessageId_key" ON "CommunityTopic"("lastMessageId");

-- AddForeignKey
ALTER TABLE "CommunityTopic" ADD CONSTRAINT "CommunityTopic_lastMessageId_fkey" FOREIGN KEY ("lastMessageId") REFERENCES "CommunityMessage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityMessage" ADD CONSTRAINT "CommunityMessage_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
