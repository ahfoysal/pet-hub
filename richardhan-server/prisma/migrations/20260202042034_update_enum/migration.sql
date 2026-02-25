/*
  Warnings:

  - The values [Package,Service] on the enum `BookingType` will be removed. If these variants are still used in the database, this will fail.
  - The values [Pending,Confirmed,InProgress,Completed,Cancelled] on the enum `PetSitterBookingStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "BookingType_new" AS ENUM ('PACKAGE', 'SERVICE');
ALTER TABLE "PetSitterBooking" ALTER COLUMN "bookingType" TYPE "BookingType_new" USING ("bookingType"::text::"BookingType_new");
ALTER TYPE "BookingType" RENAME TO "BookingType_old";
ALTER TYPE "BookingType_new" RENAME TO "BookingType";
DROP TYPE "public"."BookingType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "PetSitterBookingStatus_new" AS ENUM ('PENDING', 'CONFIRMED', 'IN_PROGRESS', 'REQUEST_TO_COMPLETE', 'COMPLETED', 'CANCELLED');
ALTER TABLE "public"."PetSitterBooking" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "PetSitterBooking" ALTER COLUMN "status" TYPE "PetSitterBookingStatus_new" USING ("status"::text::"PetSitterBookingStatus_new");
ALTER TYPE "PetSitterBookingStatus" RENAME TO "PetSitterBookingStatus_old";
ALTER TYPE "PetSitterBookingStatus_new" RENAME TO "PetSitterBookingStatus";
DROP TYPE "public"."PetSitterBookingStatus_old";
ALTER TABLE "PetSitterBooking" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterTable
ALTER TABLE "PetSitterBooking" ALTER COLUMN "status" SET DEFAULT 'PENDING';
