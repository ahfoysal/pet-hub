export type KycFiles = {
  image: Express.Multer.File[];
  identificationFrontImage: Express.Multer.File[];
  identificationBackImage: Express.Multer.File[];
  signatureImage: Express.Multer.File[];
  
  // New Fields
  businessRegistrationCertificate?: Express.Multer.File[];
  hotelLicenseImage?: Express.Multer.File[];
  hygieneCertificate?: Express.Multer.File[];
  facilityPhotos?: Express.Multer.File[];
};
