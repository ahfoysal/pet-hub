-- AlterTable
ALTER TABLE "KYC" ADD COLUMN     "businessAddress" TEXT,
ADD COLUMN     "businessName" TEXT,
ADD COLUMN     "businessRegistrationCertificate" TEXT,
ADD COLUMN     "businessRegistrationNumber" TEXT,
ADD COLUMN     "facilityPhotos" TEXT[],
ADD COLUMN     "hotelLicenseImage" TEXT,
ADD COLUMN     "hygieneCertificate" TEXT,
ADD COLUMN     "licenseExpiryDate" TEXT,
ADD COLUMN     "licenseIssueDate" TEXT,
ADD COLUMN     "licenseNumber" TEXT;
