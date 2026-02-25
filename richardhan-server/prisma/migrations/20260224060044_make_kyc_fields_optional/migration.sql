-- AlterTable
ALTER TABLE "KYC" ALTER COLUMN "gender" DROP NOT NULL,
ALTER COLUMN "nationality" DROP NOT NULL,
ALTER COLUMN "identificationNumber" DROP NOT NULL,
ALTER COLUMN "presentAddress" DROP NOT NULL,
ALTER COLUMN "permanentAddress" DROP NOT NULL,
ALTER COLUMN "emergencyContactName" DROP NOT NULL,
ALTER COLUMN "emergencyContactRelation" DROP NOT NULL;
