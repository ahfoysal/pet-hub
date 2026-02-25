-- CreateIndex
CREATE INDEX "Bookmark_postId_createdAt_idx" ON "Bookmark"("postId", "createdAt");

-- CreateIndex
CREATE INDEX "Bookmark_reelId_createdAt_idx" ON "Bookmark"("reelId", "createdAt");

-- CreateIndex
CREATE INDEX "Comment_postId_createdAt_idx" ON "Comment"("postId", "createdAt");

-- CreateIndex
CREATE INDEX "Post_isDeleted_isHidden_idx" ON "Post"("isDeleted", "isHidden");

-- CreateIndex
CREATE INDEX "Post_createdAt_idx" ON "Post"("createdAt");

-- CreateIndex
CREATE INDEX "Post_trendingScore_createdAt_idx" ON "Post"("trendingScore", "createdAt");

-- CreateIndex
CREATE INDEX "PostLike_postId_createdAt_idx" ON "PostLike"("postId", "createdAt");

-- CreateIndex
CREATE INDEX "Reel_isDeleted_isHidden_idx" ON "Reel"("isDeleted", "isHidden");

-- CreateIndex
CREATE INDEX "ReelLike_reelId_createdAt_idx" ON "ReelLike"("reelId", "createdAt");
