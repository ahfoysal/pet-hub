/*
  Warnings:

  - Added the required column `calories` to the `Food` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fat` to the `Food` table without a default value. This is not possible if the table is not empty.
  - Added the required column `protein` to the `Food` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `foodType` on the `Food` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "FoodType" AS ENUM ('VEGAN', 'NON_VEGAN', 'RAW', 'DRY', 'WET');

-- AlterTable
ALTER TABLE "Food" ADD COLUMN     "calories" INTEGER NOT NULL,
ADD COLUMN     "fat" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "isAvailable" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "maxAge" INTEGER,
ADD COLUMN     "minAge" INTEGER,
ADD COLUMN     "protein" DOUBLE PRECISION NOT NULL,
DROP COLUMN "foodType",
ADD COLUMN     "foodType" "FoodType" NOT NULL;
