# Owner Dashboard Track File

This document tracks the features, Node/API connections, work progress, and pending items for the Owner Dashboard.

## Overview
- **Repository:** `owner-dashboard`
- **Current Status:** Initial Phase (Coming Soon)
- **Total Pages:** 6

## 1. Owner Dashboard Home
- **Figma Link:** [Placeholder]
- **API Status:**
  - [x] GET `/pet-owner/dashboard`
- **Work Done:** Backend endpoint verified. Frontend shell exists.
- **Remaining:** None.

## 2. Bookings
- **Figma Link:** [Placeholder]
- **API Status:**
  - [x] GET `/booking/owner` (Fetch owner bookings)
- **Work Done:** API logic verified. Pages exist in `app/(dashboard)/(owner-dashboard)/owner/bookings`.
- **Remaining:** None.

## 3. Pets
- **Figma Link:** [Placeholder]
- **API Status:**
  - [x] GET `/pet-profile/owner`
  - [x] POST `/pet-profile`
- **Work Done:** API connected. Pages exist in `app/(dashboard)/(owner-dashboard)/owner/pets`.
- **Remaining:** None.

## 4. Services
- **Figma Link:** [Placeholder]
- **API Integration:**
  - [ ] GET `/services/browse` (Pending)
- **Work Done:** Routing established.
- **Remaining:** Service discovery UI.

## 5. Community
- **Figma Link:** [Placeholder]
- **API Status:**
  - [x] GET `/posts`
  - [x] GET `/reels`
  - [x] GET `/stories`
- **Work Done:** Fully integrated with `communityApi.ts`.
- **Remaining:** None.

## 6. Payments
- **Figma Link:** [Placeholder]
- **API Integration:**
  - [ ] GET `/payments/owner` (Pending)
- **Work Done:** Routing established.
- **Remaining:** Transaction history and payment methods.
