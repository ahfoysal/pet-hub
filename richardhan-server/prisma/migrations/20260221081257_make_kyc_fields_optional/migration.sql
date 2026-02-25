-- AlterTable
ALTER TABLE "KYC" ALTER COLUMN "dateOfBirth" DROP NOT NULL,
ALTER COLUMN "gender" DROP NOT NULL,
ALTER COLUMN "nationality" DROP NOT NULL,
ALTER COLUMN "image" DROP NOT NULL,
ALTER COLUMN "identificationNumber" DROP NOT NULL,
ALTER COLUMN "identificationFrontImage" DROP NOT NULL,
ALTER COLUMN "identificationBackImage" DROP NOT NULL,
ALTER COLUMN "signatureImage" DROP NOT NULL,
ALTER COLUMN "presentAddress" DROP NOT NULL,
ALTER COLUMN "permanentAddress" DROP NOT NULL,
ALTER COLUMN "emergencyContactName" DROP NOT NULL,
ALTER COLUMN "emergencyContactRelation" DROP NOT NULL,
ALTER COLUMN "emergencyContactPhone" DROP NOT NULL;
