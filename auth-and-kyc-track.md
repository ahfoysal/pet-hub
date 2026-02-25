# Auth & KYC Flow Track File

This document tracks the features, Node/API connections, work progress, and pending items for the Auth & KYC Flow.

## 1. Login
- **Figma Link:** https://www.figma.com/design/Thjl4HdumD1tNTQlBPJIoY/richardhan9%7C%7C-Bytescout%7C%7C-FO61AEA1E4782--Copy-?node-id=11154-1628&m=dev
- **API Status:** 
  - [x] POST `/auth/send-otp` (Send OTP)
- **Work Done:** UI implementation, validation, and OTP integration complete.
- **Remaining:** None.

## 2. Sign Up
- **Figma Link:** https://www.figma.com/design/Thjl4HdumD1tNTQlBPJIoY/richardhan9%7C%7C-Bytescout%7C%7C-FO61AEA1E4782--Copy-?node-id=11154-1711&m=dev
- **API Status:**
  - [x] POST `/auth/signup` (Register with Profile Photo)
- **Work Done:** Registration form with file upload integrated with backend.
- **Remaining:** None.

## 3. OTP Verification
- **Figma Link:** https://www.figma.com/design/Thjl4HdumD1tNTQlBPJIoY/richardhan9%7C%7C-Bytescout%7C%7C-FO61AEA1E4782--Copy-?node-id=11154-1764&m=dev
- **API Status:**
  - [x] POST `/auth/verify-otp` (Final Auth via NextAuth)
- **Work Done:** Integrated with NextAuth and backend session.
- **Remaining:** None.

## 4. Role Selection
- **Figma Link:** https://www.figma.com/design/Thjl4HdumD1tNTQlBPJIoY/richardhan9%7C%7C-Bytescout%7C%7C-FO61AEA1E4782--Copy-?node-id=11154-1675&m=dev
- **API Status:** Local State
- **Work Done:** Role selection UI and session handling complete.
- **Remaining:** None.

## 5. KYC - Step 1: Identity Information
- **Figma Link:** https://www.figma.com/design/Thjl4HdumD1tNTQlBPJIoY/richardhan9%7C%7C-Bytescout%7C%7C-FO61AEA1E4782--Copy-?node-id=11048-3067&m=dev
- **API Status:** Part of `/kyc` submission
- **Work Done:** UI refined to match Figma, validation adjusted for optional fields (DOB, etc.).
- **Remaining:** None.

## 6. KYC - Step 2: Business Information
- **Figma Link:** https://www.figma.com/design/Thjl4HdumD1tNTQlBPJIoY/richardhan9%7C%7C-Bytescout%7C%7C-FO61AEA1E4782--Copy-?node-id=11048-1886&m=dev
- **API Status:** Part of `/kyc` submission
- **Work Done:** UI ready.
- **Remaining:** Data flow to final submission.

## 7. KYC - Step 3: Pet Hotel License
- **Figma Link:** https://www.figma.com/design/Thjl4HdumD1tNTQlBPJIoY/richardhan9%7C%7C-Bytescout%7C%7C-FO61AEA1E4782--Copy-?node-id=11064-2112&m=dev
- **API Status:** Part of `/kyc` submission
- **Work Done:** UI ready.
- **Remaining:** Data flow to final submission.

## 8. KYC - Step 4: Facility Verification (Optional)
- **Figma Link:** https://www.figma.com/design/Thjl4HdumD1tNTQlBPJIoY/richardhan9%7C%7C-Bytescout%7C%7C-FO61AEA1E4782--Copy-?node-id=11064-2653&m=dev
- **API Status:** Part of `/kyc` submission
- **Work Done:** UI ready.
- **Remaining:** None.

## 9. KYC - Step 5: Review & Submit
- **Figma Link:** https://www.figma.com/design/Thjl4HdumD1tNTQlBPJIoY/richardhan9%7C%7C-Bytescout%7C%7C-FO61AEA1E4782--Copy-?node-id=11064-3089&m=dev
- **API Status:**
  - [x] POST `/kyc` (Final submission with files)
- **Work Done:** Review UI and multipart/form-data submission logic complete.
- **Remaining:** None.
