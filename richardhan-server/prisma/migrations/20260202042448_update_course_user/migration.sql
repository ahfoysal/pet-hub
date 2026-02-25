/*
  Warnings:

  - A unique constraint covering the columns `[petProfileId,courseId]` on the table `CourseUser` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `petProfileId` to the `CourseUser` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "CourseUser_userId_courseId_key";

-- AlterTable
ALTER TABLE "CourseUser" ADD COLUMN     "petProfileId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "CourseUser_petProfileId_courseId_key" ON "CourseUser"("petProfileId", "courseId");

-- AddForeignKey
ALTER TABLE "CourseUser" ADD CONSTRAINT "CourseUser_petProfileId_fkey" FOREIGN KEY ("petProfileId") REFERENCES "PetProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
