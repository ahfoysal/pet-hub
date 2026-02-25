/*
  Warnings:

  - You are about to drop the column `music` on the `Reel` table. All the data in the column will be lost.
  - Added the required column `duration` to the `Reel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `visibility` to the `Reel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Reel" DROP COLUMN "music",
ADD COLUMN     "duration" INTEGER NOT NULL,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "trendingScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "visibility" "Visibility" NOT NULL;
