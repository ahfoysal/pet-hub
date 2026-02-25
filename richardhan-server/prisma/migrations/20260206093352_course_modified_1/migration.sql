/*
  Warnings:

  - You are about to drop the column `availableSeats` on the `Course` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[petProfileId,scheduleId]` on the table `CourseUser` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `availableSeats` to the `CourseSchedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scheduleId` to the `CourseUser` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "CourseUser_petProfileId_courseId_key";

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "availableSeats";

-- AlterTable
ALTER TABLE "CourseSchedule" ADD COLUMN     "availableSeats" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "CourseUser" ADD COLUMN     "scheduleId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "CourseUser_petProfileId_scheduleId_key" ON "CourseUser"("petProfileId", "scheduleId");

-- AddForeignKey
ALTER TABLE "CourseUser" ADD CONSTRAINT "CourseUser_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "CourseSchedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
