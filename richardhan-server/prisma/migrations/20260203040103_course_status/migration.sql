-- CreateEnum
CREATE TYPE "CourseEnrollmentStatus" AS ENUM ('PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED', 'EXPIRED', 'REJECTED');

-- AlterTable
ALTER TABLE "CourseUser" ADD COLUMN     "cancelledAt" TIMESTAMP(3),
ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "enrolledAt" TIMESTAMP(3),
ADD COLUMN     "paymentId" TEXT,
ADD COLUMN     "status" "CourseEnrollmentStatus" NOT NULL DEFAULT 'PENDING';

-- AddForeignKey
ALTER TABLE "CourseUser" ADD CONSTRAINT "CourseUser_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
