/*
  Warnings:

  - Added the required column `petSchoolId` to the `Employee` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "petSchoolId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_petSchoolId_fkey" FOREIGN KEY ("petSchoolId") REFERENCES "PetSchoolProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
