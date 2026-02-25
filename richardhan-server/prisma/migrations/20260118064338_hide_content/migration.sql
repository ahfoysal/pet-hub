-- CreateEnum
CREATE TYPE "ContentType" AS ENUM ('POST', 'REEL');

-- CreateTable
CREATE TABLE "HiddenContent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "contentType" "ContentType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HiddenContent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HiddenContent_userId_contentId_contentType_key" ON "HiddenContent"("userId", "contentId", "contentType");

-- AddForeignKey
ALTER TABLE "HiddenContent" ADD CONSTRAINT "HiddenContent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
