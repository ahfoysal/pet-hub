/*
  Warnings:

  - You are about to drop the column `caption` on the `Story` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Moment" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isHidden" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Story" DROP COLUMN "caption",
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "isPublished" SET DEFAULT true;
