-- CreateIndex
CREATE INDEX "HiddenContent_userId_contentType_idx" ON "HiddenContent"("userId", "contentType");

-- AddForeignKey
ALTER TABLE "HiddenContent" ADD CONSTRAINT "HiddenPost" FOREIGN KEY ("contentId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HiddenContent" ADD CONSTRAINT "HiddenReel" FOREIGN KEY ("contentId") REFERENCES "Reel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
