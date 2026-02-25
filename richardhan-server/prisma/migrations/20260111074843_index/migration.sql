-- AlterTable
ALTER TABLE "Story" ADD COLUMN     "likeCount" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "Story_expiresAt_isPublished_isDeleted_idx" ON "Story"("expiresAt", "isPublished", "isDeleted");
