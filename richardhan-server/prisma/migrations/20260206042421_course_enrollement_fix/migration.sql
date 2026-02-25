/*
  Warnings:

  - The values [PENDING,ACTIVE,EXPIRED] on the enum `CourseEnrollmentStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CourseEnrollmentStatus_new" AS ENUM ('PAYMENT_PENDING', 'PAYMENT_DONE', 'APPROVED', 'REJECTED', 'CANCELLED', 'REFUNDED', 'COMPLETED');
ALTER TABLE "public"."CourseUser" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "CourseUser" ALTER COLUMN "status" TYPE "CourseEnrollmentStatus_new" USING ("status"::text::"CourseEnrollmentStatus_new");
ALTER TYPE "CourseEnrollmentStatus" RENAME TO "CourseEnrollmentStatus_old";
ALTER TYPE "CourseEnrollmentStatus_new" RENAME TO "CourseEnrollmentStatus";
DROP TYPE "public"."CourseEnrollmentStatus_old";
ALTER TABLE "CourseUser" ALTER COLUMN "status" SET DEFAULT 'PAYMENT_PENDING';
COMMIT;

-- AlterTable
ALTER TABLE "CourseUser" ALTER COLUMN "status" SET DEFAULT 'PAYMENT_PENDING';
