/*
  Warnings:

  - You are about to drop the column `mediaType` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `petId` on the `Post` table. All the data in the column will be lost.
  - Added the required column `bookMarkType` to the `Bookmark` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Bookmark` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `visibility` on the `Post` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "PostVisibilityType" AS ENUM ('PUBLIC', 'PRIVATE', 'FRIENDS');

-- CreateEnum
CREATE TYPE "BookmarkType" AS ENUM ('POST', 'REEL');

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_petId_fkey";

-- AlterTable
ALTER TABLE "Bookmark" ADD COLUMN     "bookMarkType" "BookmarkType" NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "mediaType",
DROP COLUMN "petId",
DROP COLUMN "visibility",
ADD COLUMN     "visibility" "PostVisibilityType" NOT NULL;

-- DropEnum
DROP TYPE "VisibilityType";
