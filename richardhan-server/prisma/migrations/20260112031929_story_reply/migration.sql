-- CreateTable
CREATE TABLE "StoryReplies" (
    "id" TEXT NOT NULL,
    "storyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StoryReplies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "StoryReplies_storyId_idx" ON "StoryReplies"("storyId");

-- AddForeignKey
ALTER TABLE "StoryReplies" ADD CONSTRAINT "StoryReplies_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoryReplies" ADD CONSTRAINT "StoryReplies_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
