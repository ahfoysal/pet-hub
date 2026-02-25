# Pet Hotel Admin Panel Track File

This document tracks the features, Node/API connections, work progress, and pending items for the Pet Hotel Admin Panel.

## 1. Dashboard Overview

- **Figma Link:** https://www.figma.com/design/Thjl4HdumD1tNTQlBPJIoY/richardhan9%7C%7C-Bytescout%7C%7C-FO61AEA1E4782--Copy-?node-id=11027-4318&m=dev
- **API Status:**
  - [x] GET `/pet-hotel/dashboard` (Fetch dashboard stats)
- **Work Done:** Backend endpoint verified. Frontend using `hotelDashboardApi.ts`.
- **Remaining:** None.

## 2. Analytics

- **Figma Link:** https://www.figma.com/design/Thjl4HdumD1tNTQlBPJIoY/richardhan9%7C%7C-Bytescout%7C%7C-FO61AEA1E4782--Copy-?node-id=11027-5097&m=dev
- **API Status:**
  - [x] GET `/hotel/analytics` (Merged into Dashboard)
- **Work Done:** Native Recharts graphs (Area, Pie, Bar) integrated directly into the `hotel/page.tsx` dashboard.
- **Remaining:** None.

## 3. Room Management

- **Figma Link:** https://www.figma.com/design/Thjl4HdumD1tNTQlBPJIoY/richardhan9%7C%7C-Bytescout%7C%7C-FO61AEA1E4782--Copy-?node-id=11722-3606&m=dev
- **API Status:**
  - [x] GET `/room/me` (Fetch my rooms)
  - [x] POST `/room` (Create room)
  - [x] PATCH `/room/update/:id` (Edit room)
  - [x] DELETE `/room/remove/:id` (Delete room)
- **Work Done:** Fully integrated with `hotelRoomApi`.
- **Remaining:** None.

## 4. Guest Management

- **Figma Link:** https://www.figma.com/design/Thjl4HdumD1tNTQlBPJIoY/richardhan9%7C%7C-Bytescout%7C%7C-FO61AEA1E4782--Copy-?node-id=11030-16127&m=dev
- **API Status:**
  - [x] GET `/booking/hotel-bookings`
  - [x] PATCH `/booking/:id/cancel`
- **Work Done:** Replaced the ComingSoon component with `GuestManagementClient`, fetching booking statuses connected via `hotelBookingApi.ts`.
- **Remaining:** None.

## 5. Finance & Payments

- **Figma Link:** https://www.figma.com/design/Thjl4HdumD1tNTQlBPJIoY/richardhan9%7C%7C-Bytescout%7C%7C-FO61AEA1E4782--Copy-?node-id=11029-14780&m=dev
- **API Status:**
  - [ ] GET `/hotel/finance` (Backend integration pending)
- **Work Done:** Constructed `HotelFinanceClient` layout supporting tabs for Overview, Transactions, and Payout History using placeholder structure.
- **Remaining:** Real backend linkage when explicit hotel payout endpoints become available.

## 6. Settings (Profile, Security, Banking)

- **Figma Link:** https://www.figma.com/design/Thjl4HdumD1tNTQlBPJIoY/richardhan9%7C%7C-Bytescout%7C%7C-FO61AEA1E4782--Copy-?node-id=11032-2764&m=dev
- **API Status:**
  - [x] GET `/pet-hotel/profile`
  - [x] PUT `/pet-hotel/profile`
  - [x] PATCH `/pet-hotel/address`
- **Work Done:** Profile management integrated and paths verified.
- **Remaining:** Banking API hooks (Backend model `BankInformation` is ready).
