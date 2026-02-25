-- CreateIndex
CREATE INDEX "CommunityMessage_topicId_sentAt_idx" ON "CommunityMessage"("topicId", "sentAt");

-- CreateIndex
CREATE INDEX "CommunityTopic_lastMessageAt_idx" ON "CommunityTopic"("lastMessageAt");

-- CreateIndex
CREATE INDEX "CommunityTopic_creatorId_idx" ON "CommunityTopic"("creatorId");

-- CreateIndex
CREATE INDEX "CommunityTopic_isDeleted_lastMessageAt_idx" ON "CommunityTopic"("isDeleted", "lastMessageAt");

-- CreateIndex
CREATE INDEX "Conversation_user1Id_lastMessageAt_idx" ON "Conversation"("user1Id", "lastMessageAt");

-- CreateIndex
CREATE INDEX "Conversation_user2Id_lastMessageAt_idx" ON "Conversation"("user2Id", "lastMessageAt");
