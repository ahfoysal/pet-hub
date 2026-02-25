-- DropForeignKey
ALTER TABLE "StoryReplies" DROP CONSTRAINT "StoryReplies_storyId_fkey";

-- DropForeignKey
ALTER TABLE "StoryReplies" DROP CONSTRAINT "StoryReplies_userId_fkey";

-- AlterTable
ALTER TABLE "StoryReplies" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "StoryReplies" ADD CONSTRAINT "StoryReplies_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoryReplies" ADD CONSTRAINT "StoryReplies_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
