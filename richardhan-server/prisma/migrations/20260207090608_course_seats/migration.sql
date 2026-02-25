/*
  Warnings:

  - Added the required column `totalSeats` to the `CourseSchedule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CourseSchedule" ADD COLUMN     "totalSeats" INTEGER NOT NULL;
