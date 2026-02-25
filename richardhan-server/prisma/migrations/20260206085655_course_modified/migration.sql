/*
  Warnings:

  - The values [PAYMENT_PENDING,PAYMENT_DONE,REFUNDED] on the enum `CourseEnrollmentStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `endingTime` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `startingTime` on the `Course` table. All the data in the column will be lost.
  - The `discount` column on the `Course` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `location` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CourseEnrollmentStatus_new" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED', 'COMPLETED');
ALTER TABLE "public"."CourseUser" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "CourseUser" ALTER COLUMN "status" TYPE "CourseEnrollmentStatus_new" USING ("status"::text::"CourseEnrollmentStatus_new");
ALTER TYPE "CourseEnrollmentStatus" RENAME TO "CourseEnrollmentStatus_old";
ALTER TYPE "CourseEnrollmentStatus_new" RENAME TO "CourseEnrollmentStatus";
DROP TYPE "public"."CourseEnrollmentStatus_old";
ALTER TABLE "CourseUser" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "endingTime",
DROP COLUMN "startingTime",
ADD COLUMN     "location" TEXT NOT NULL,
ADD COLUMN     "outcomes" TEXT[],
DROP COLUMN "discount",
ADD COLUMN     "discount" INTEGER;

-- AlterTable
ALTER TABLE "CourseUser" ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- CreateTable
CREATE TABLE "CourseSchedule" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "days" TEXT[],
    "time" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CourseSchedule_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CourseSchedule" ADD CONSTRAINT "CourseSchedule_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
