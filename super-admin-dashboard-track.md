# Super Admin Dashboard Track File

This document tracks the features, Node/API connections, work progress, and pending items for the Super Admin Dashboard.

## Overview
- **Repository:** `super-admin-dashboard`
- **Current Status:** In Progress
- **Total Pages:** 12

## 1. Dashboard Home
- **Figma Link:** https://www.figma.com/design/Thjl4HdumD1tNTQlBPJIoY/richardhan9%7C%7C-Bytescout%7C%7C-FO61AEA1E4782--Copy-?node-id=12934-3916&m=dev
- **API Integration:** 
  - [x] GET `/admin-dashboard-overview/roles/count` (Users count by role)
  - [x] GET `/admin-dashboard-overview/kyc/recent` (Recent KYC submissions)
- **Work Done:** Backend endpoints verified. `adminDashboardApi.ts` needs to be populated with these.
- **Remaining:** Implement Recharts components (Line & Bar) and Recent Activity timeline.

## 2. Manage Users (All)
- **Figma Link:** [Placeholder]
- **API Integration:**
  - [x] GET `/user` (Fetch all users)
  - [x] GET `/admin/banned-users` (Fetch banned users)
  - [x] GET `/admin/suspend-users` (Fetch suspended users)
  - [x] PATCH `/admin/reactivate-user/:userId` (Reactivate user)
  - [x] PATCH `/admin/ban-user` (Ban user)
  - [x] PATCH `/admin/suspend-user` (Suspend user)
- **Work Done:** API paths verified and matching `manageUsersApi.ts`.
- **Remaining:** None.

## 3. Pet Owners (Users)
- **Figma Link:** https://www.figma.com/design/Thjl4HdumD1tNTQlBPJIoY/richardhan9%7C%7C-Bytescout%7C%7C-FO61AEA1E4782--Copy-?node-id=12819-3832&m=dev
- **API Integration:**
  - [x] GET `/admin-dashboard-overview/pet-owners?search=&cursor=&limit=20`
- **Work Done:** Backend endpoint verified. Supports pagination and search by name/email.
- **Remaining:** Implement specific UI design from Figma.

## 4. Pet Sitters
- **Figma Link:** https://www.figma.com/design/Thjl4HdumD1tNTQlBPJIoY/richardhan9%7C%7C-Bytescout%7C%7C-FO61AEA1E4782--Copy-?node-id=12969-24133&m=dev
- **API Integration:**
  - [x] GET `/admin-dashboard-overview/pet-sitter?search=&cursor=&limit=20`
- **Work Done:** Backend endpoint verified. Includes counts for services and packages.
- **Remaining:** Implement specific UI design from Figma.

## 5. KYC Submissions
- **Figma Link:** [Placeholder]
- **API Integration:**
  - [x] GET `/kyc` (Fetch all submissions)
  - [x] GET `/kyc/:id` (Fetch single submission)
  - [x] PATCH `/kyc/approval/:id` (Approve KYC)
  - [x] PATCH `/kyc/rejection/:id` (Reject KYC)
- **Work Done:** API connected to `adminKycApi`.
- **Remaining:** Bulk actions.

## 6. Analytics
- **Figma Link:** https://www.figma.com/design/Thjl4HdumD1tNTQlBPJIoY/richardhan9%7C%7C-Bytescout%7C%7C-FO61AEA1E4782--Copy-?node-id=12671-3617&m=dev
- **API Integration:**
  - [ ] GET `/analytics/overview` (Pending)
- **Work Done:** UI shells.
- **Remaining:** API connection and full UI implementation according to Figma.

## 7. Community & Moderation
- **Figma Link:** [Placeholder]
- **API Integration:**
  - [x] GET `/reports` (Fetch all reports with filters)
  - [x] PATCH `/reports/:reportId/take-action` (Moderation: BAN, SUSPEND, HIDE, DELETE)
- **Work Done:** Backend endpoints verified. `Prisma` model `Report` reviewed.
- **Remaining:** Create `reportApi.ts` in frontend and implement Moderation dashboard.

## 8. Finance & Payments / Payouts
- **Figma Link:** https://www.figma.com/design/Thjl4HdumD1tNTQlBPJIoY/richardhan9%7C%7C-Bytescout%7C%7C-FO61AEA1E4782--Copy-?node-id=12851-5762&m=dev
- **API Integration:**
  - [x] GET `/admin-dashboard-overview/hotels` (Used as proxy for business volume)
  - [ ] Dedicated Transaction API (Pending)
- **Work Done:** Backend `Prisma` model `Payment` exists with full audit trail.
- **Remaining:** Create dedicated backend controller for global transaction history and payouts.

## 9. Platform Settings
- **Figma Link:** [Placeholder]
- **API Integration:**
  - [x] GET `/platform-settings`
  - [x] PATCH `/platform-settings`
  - [x] GET `/platform-settings/history`
- **Work Done:** API paths verified and matching `platformSettingsApi.ts`.
- **Remaining:** None.

## 10. Room Management
- **Figma Link:** [Placeholder]
- **API Integration:**
  - [ ] Global Room Config (Pending)
- **Work Done:** UI.
- **Remaining:** API integration.

## 11. Food Menu
- **Figma Link:** [Placeholder]
- **API Integration:**
  - [ ] Global Menu Config (Pending)
- **Work Done:** UI.
- **Remaining:** API integration.

## 12. Guests
- **Figma Link:** [Placeholder]
- **API Integration:**
  - [ ] Guest Overview API (Pending)
- **Work Done:** Layout.
- **Remaining:** API integration.
