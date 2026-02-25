-- AlterTable
ALTER TABLE "CommunityMessage" ADD COLUMN     "mediaType" TEXT,
ADD COLUMN     "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "CommunityTopicUser" (
    "userId" TEXT NOT NULL,
    "communityTopicId" TEXT NOT NULL,

    CONSTRAINT "CommunityTopicUser_pkey" PRIMARY KEY ("userId","communityTopicId")
);

-- AddForeignKey
ALTER TABLE "CommunityTopicUser" ADD CONSTRAINT "CommunityTopicUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityTopicUser" ADD CONSTRAINT "CommunityTopicUser_communityTopicId_fkey" FOREIGN KEY ("communityTopicId") REFERENCES "CommunityTopic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
