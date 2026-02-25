/*
  Warnings:

  - The `status` column on the `PetSitterProfile` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `VendorProfile` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ProfileStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'PENDING', 'BLOCKED');

-- AlterTable
ALTER TABLE "HotelProfile" ADD COLUMN     "status" "ProfileStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "PetSchoolProfile" ADD COLUMN     "status" "ProfileStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "PetSitterProfile" DROP COLUMN "status",
ADD COLUMN     "status" "ProfileStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "VendorProfile" DROP COLUMN "status",
ADD COLUMN     "status" "ProfileStatus" NOT NULL DEFAULT 'PENDING';

-- DropEnum
DROP TYPE "VendorStatus";
