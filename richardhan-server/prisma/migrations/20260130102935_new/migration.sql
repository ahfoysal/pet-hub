/*
  Warnings:

  - You are about to drop the column `pricing` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `assignedTasks` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `employeeType` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `organizationId` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `organizationType` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `shift` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Employee` table. All the data in the column will be lost.
  - Added the required column `price` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Course" DROP COLUMN "pricing",
ADD COLUMN     "price" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Employee" DROP COLUMN "assignedTasks",
DROP COLUMN "employeeType",
DROP COLUMN "organizationId",
DROP COLUMN "organizationType",
DROP COLUMN "shift",
DROP COLUMN "status";
