-- DropIndex
DROP INDEX "Story_expiresAt_isPublished_isDeleted_idx";

-- DropIndex
DROP INDEX "Story_isPublished_expiresAt_idx";

-- DropIndex
DROP INDEX "Story_userId_idx";

-- CreateIndex
CREATE INDEX "Story_isPublished_isDeleted_expiresAt_idx" ON "Story"("isPublished", "isDeleted", "expiresAt");

-- CreateIndex
CREATE INDEX "story_feed_order" ON "Story"("trendingScore", "createdAt", "id");

-- CreateIndex
CREATE INDEX "Story_userId_visibility_idx" ON "Story"("userId", "visibility");
