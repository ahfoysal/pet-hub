# Pet School Admin Track File

This document tracks the features, Node/API connections, work progress, and pending items for the Pet School Admin Panel.

## 1. Dashboard
- **Figma Link:** [Placeholder]
- **API Status:**
  - [ ] GET `/school/stats` (Pending)
- **Work Done:** Base layout.
- **Remaining:** Dashboard stats integration.

## 2. Course Management
- **Figma Link:** [Placeholder]
- **API Status:**
  - [x] GET `/course/my-courses` (Fetch my courses)
  - [x] POST `/course/create` (Create course)
  - [x] PATCH `/course/:courseId` (Update course)
  - [x] DELETE `/course/:courseId` (Remove course)
- **Work Done:** API paths verified and matching `SchoolCoursesApi.ts`.
- **Remaining:** None.

## 3. Trainer Management
- **Figma Link:** [Placeholder]
- **API Status:**
  - [x] GET `/trainer/my-trainers` (Fetch my trainers)
  - [x] POST `/trainer` (Register trainer)
  - [x] PATCH `/trainer/:trainerId` (Update trainer)
  - [x] DELETE `/trainer/:trainerId` (Remove trainer)
- **Work Done:** Full CRUD integration verified with backend `TrainerController`.
- **Remaining:** Trainer scheduling UI.

## 4. Admission & Students
- **Figma Link:** [Placeholder]
- **API Status:**
  - [ ] GET `/school/admissions` (Pending)
- **Work Done:** UI Ready.
- **Remaining:** API Connection.

## 5. Schedules
- **Figma Link:** [Placeholder]
- **API Status:**
  - [ ] GET `/school/schedules` (Pending)
- **Work Done:** Routing set up.
- **Remaining:** Implementation and integration.
