# Pet Sitter Booking Flow - Complete Documentation

## Table of Contents

1. [Overview](#overview)
2. [Booking Lifecycle](#booking-lifecycle)
3. [State Transition Diagram](#state-transition-diagram)
4. [Detailed State Descriptions](#detailed-state-descriptions)
5. [Key Actors](#key-actors)
6. [Booking Creation Workflow](#booking-creation-workflow)
7. [Booking Confirmation Workflow](#booking-confirmation-workflow)
8. [In-Progress & Completion Flow](#in-progress--completion-flow)
9. [Cancellation Rules](#cancellation-rules)
10. [Automated Processes (Cron Jobs)](#automated-processes-cron-jobs)
11. [Database Schema](#database-schema)
12. [API Endpoints](#api-endpoints)
13. [Error Handling & Validations](#error-handling--validations)
14. [Payment Integration](#payment-integration)

---

## Overview

The Pet Sitter Booking System is a comprehensive workflow that manages the entire lifecycle of booking a pet sitter for pet care services. It supports two types of bookings:

- **SERVICE Bookings**: Direct booking of a single service offered by a pet sitter
- **PACKAGE Bookings**: Booking of a pre-configured package of services, with optional additional services

The system manages complex state transitions, validates availability, prevents scheduling conflicts, handles cancellations, tracks completion proof, and integrates with automated processes.

### Key Features:

- ✅ Dual booking types (Service & Package)
- ✅ Availability conflict detection
- ✅ Flexible location (pet owner's home or pet sitter's location)
- ✅ Additional services support for packages
- ✅ Grace period for late starts (10 minutes)
- ✅ Late booking detection and tracking
- ✅ Completion proof with photo/video uploads
- ✅ Cancellation tracking with user/role info
- ✅ Platform fee calculation
- ✅ Automated expiration and status updates

---

## Booking Lifecycle

A booking progresses through a series of **distinct states**. Each state represents a specific phase in the booking's journey.

### State Sequence (Happy Path):

```
PENDING → CONFIRMED → IN_PROGRESS → REQUEST_TO_COMPLETE → COMPLETED
```

### State Sequence (With Cancellation or Expiration):

```
PENDING → CANCELLED
PENDING → EXPIRED (after 15 minutes from start time without confirmation)
CONFIRMED → LATE (if start time passes without being marked IN_PROGRESS)
```

---

## State Transition Diagram

```
                           ┌─────────────────────────────────────────┐
                           │   PENDING (Initial State)               │
                           │  - Awaiting pet sitter confirmation     │
                           │  - Duration: 15 min grace period        │
                           └─────────────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
                    ▼               ▼               ▼
              [CONFIRMED]     [CANCELLED]       [EXPIRED]
         ✅ Sitter accepts    ❌ By owner or    ⏱️ Auto-expired
                    │             sitter          (cron job)
                    │
                    ▼
        ┌─────────────────────────┐
        │ LATE (Auto-marked)      │
        │ - Start time passed     │
        │ - Not marked IN_PROGRESS│
        │ - Cron job (5 mins)     │
        └─────────────────────────┘
                    │
                    ▼
              [IN_PROGRESS]
         🟢 Sitter starts service
         ⚠️ Max 1 per sitter
         ⏱️ Grace: 10 mins before start
                    │
                    ▼
         [REQUEST_TO_COMPLETE]
    📝 Sitter uploads completion proof
    🔒 Photo/video evidence required
         + Optional completion note
                    │
                    ▼
              [COMPLETED]
         ✅ Owner approves completion
         - Sitter moves to OFF_SERVICE
```

---

## Detailed State Descriptions

### 1. **PENDING** (Initial State)

- **Duration**: From creation until pet sitter confirms or auto-expires
- **What happens**: Booking is created and waiting for pet sitter confirmation
- **Who can affect it**:
  - Pet Sitter: Can confirm (→ CONFIRMED)
  - Pet Owner/Sitter: Can cancel (→ CANCELLED)
  - System (Cron): Auto-expires after 15 minutes from start time (→ EXPIRED)
- **Key properties**:
  - `startingTime`: Scheduled start time
  - `finishingTime`: Calculated end time based on duration
  - `status`: PENDING
  - `bookingId`: Unique identifier (format: B{timestamp})
  - `isLate`: false (initially)
  - `cancelledByUserId`: null
- **Validation**: Before creation, system checks:
  - Pet sitter NOT on vacation
  - No overlapping confirmed/in-progress bookings
  - All pets belong to pet owner
  - Service/Package is available
  - Booking time is in the future

---

### 2. **CONFIRMED** (Sitter Acceptance)

- **Duration**: From sitter confirmation until service begins or late deadline
- **Trigger**: Pet sitter explicitly confirms the booking
- **What happens**: Pet sitter has committed to the service
- **Who can affect it**:
  - System (Cron): Can mark as LATE if start time passes and not IN_PROGRESS
  - Pet Sitter: Can start service within 10-minute grace period (→ IN_PROGRESS)
- **Key triggers for state change**:
  - Sitter calls `confirmBooking()` endpoint
  - System automatically marks LATE at designated time
- **Important validation for confirmation**:
  - Sitter must not have another IN_PROGRESS booking
  - Sitter must not be on vacation
  - Sitter profile must be ACTIVE
  - Booking must be in PENDING state
  - No overlapping CONFIRMED/IN_PROGRESS bookings

---

### 3. **LATE** (Missed Start Time)

- **Duration**: From missed start time → until IN_PROGRESS or booking ends
- **Trigger**: Automatic (cron job runs every 5 minutes)
- **What happens**: Pet sitter didn't start the service at the scheduled time
- **Cron Job Details**:
  - Runs every 5 minutes
  - Marks bookings with `status=CONFIRMED` and `startingTime < now` as LATE
  - Sets `isLate=true`
  - Processes max 500 bookings per run in batches of 50
- **Key fields updated**:
  - `status`: LATE
  - `isLate`: true
  - `minutesLate`: Calculated when moving to IN_PROGRESS
- **Next transition**: Pet sitter can still start within grace period (IN_PROGRESS)

---

### 4. **IN_PROGRESS** (Service Being Delivered)

- **Duration**: From service start until sitter requests completion
- **Trigger**: Pet sitter explicitly marks booking as IN_PROGRESS
- **What happens**: Service is actively being delivered
- **Important Constraints**:
  - **Maximum 1 per sitter**: A pet sitter can ONLY have 1 booking IN_PROGRESS at any time
  - **Grace period enforcement**: Can only start within 10 minutes BEFORE scheduled start time
- **Pet Sitter Status**: Updated to `ON_SERVICE` to indicate availability
- **Late tracking**:
  - If `isLate=true`, system calculates `minutesLate` when transitioning
  - Formula: `Math.floor((now - startingTime) / 1000 / 60)` minutes
- **Key method**: `markAsInProgress(bookingId, userId)`
  - Validates sitter is ACTIVE and profile is ACTIVE
  - Checks no other IN_PROGRESS booking exists
  - Enforces grace period validation
  - Updates sitter availability status

---

### 5. **REQUEST_TO_COMPLETE** (Completion Submitted)

- **Duration**: From sitter's completion request → owner approval
- **Trigger**: Pet sitter submits completion proof with optional note
- **What happens**: Sitter has finished and provided evidence of completion
- **Requirements**:
  - ✅ Completion proof (photos/videos) REQUIRED
  - ✅ Files uploaded to Cloudinary (cloud storage)
  - ✅ Optional completion note (max 500 characters)
  - ✅ Only transition from IN_PROGRESS
- **Key method**: `requestToComplete(bookingId, userId, payload, files)`
  - Validates sitter is ACTIVE
  - Uploads files to Cloudinary and stores URLs
  - Stores `completionNote` and URLs in `completionProof` array
  - Records `requestCompletedAt` timestamp
  - Transition is atomic (database transaction)
- **What's stored**:
  - `completionProof`: Array of image/video URLs from Cloudinary
  - `completionNote`: Text note (0-500 chars)
  - `requestCompletedAt`: Timestamp of submission

---

### 6. **COMPLETED** (Booking Finished)

- **Duration**: Final state, no further transitions
- **Trigger**: Pet owner approves and completes the booking
- **What happens**: Booking is fully completed and finalized
- **Key method**: `completeBooking(bookingId, userId)`
  - Validates user is PET_OWNER and ACTIVE
  - Booking must be in REQUEST_TO_COMPLETE state
  - Updates `status` to COMPLETED
  - Records `completedAt` timestamp
  - Sitter status reverts to OFF_SERVICE
- **Effects**:
  - 🔄 Sitter moves from ON_SERVICE → OFF_SERVICE
  - ✅ Service is finalized
  - 💳 Payment processed (if not already done)
  - ⭐ Reviews can now be submitted

---

### 7. **CANCELLED** (Cancellation)

- **Duration**: Final state, no further transitions
- **Trigger**: Pet owner or pet sitter cancels
- **Restrictions**: Only PENDING bookings can be cancelled
- **Who can cancel**:
  - 👤 Pet Owner (client who created booking)
  - 🔨 Pet Sitter (service provider)
- **What happens**: Booking is cancelled and cannot proceed
- **Key method**: `cancelBooking(bookingId, userId)`
  - Only works on PENDING status
  - Records who cancelled: `cancelledByUserId` and `cancelledByRole`
  - Example: You can't cancel a CONFIRMED booking (must contact sitter)
- **Data tracked**:
  - `cancelledByUserId`: ID of user who cancelled
  - `cancelledByRole`: ENUM (PET_OWNER | PET_SITTER)
  - `cancelledAt`: Timestamp of cancellation
- **Implications**:
  - No service delivery
  - May affect refunds (payment-dependent)
  - Cannot be reversed (creates new booking if needed)

---

### 8. **EXPIRED** (Auto-Expiration)

- **Duration**: Final state, no further transitions
- **Trigger**: Automatic expiration after grace period
- **What happens**: Booking auto-expired because sitter didn't confirm in time
- **Cron Job Details**:
  - Runs every 10 minutes
  - Checks for PENDING bookings where `startingTime < (now - 15 minutes grace)`
  - Marks them as EXPIRED
  - Processes max 500 bookings per run in batches of 50
  - Grace period: 15 minutes from scheduled start time
- **Example timeline**:
  1. Booking created at 10:00 AM for 10:30 AM start
  2. Sitter must confirm by 10:45 AM (15-min grace)
  3. If not confirmed by 10:45 AM, cron marks as EXPIRED at next run
- **Implications**:
  - Service won't be delivered
  - Pet owner needs to rebook
  - Sitter can't confirm expired bookings

---

## Key Actors

### 1. **Pet Owner (Client)**

- Creates bookings
- Selects pets and services
- Specifies location (own home or sitter's)
- Can cancel PENDING bookings
- Approves completion and marks booking COMPLETED
- Leaves reviews

### 2. **Pet Sitter (Service Provider)**

- Receives booking request (PENDING)
- Confirms or rejects booking
- Can't accept if on vacation
- Marks booking IN_PROGRESS (with constraints)
- Submits completion proof + optional notes
- Can cancel PENDING bookings
- Moves between status states: ON_SERVICE, OFF_SERVICE, ON_VACATION

### 3. **System (Automated Processes)**

- Detects and marks LATE bookings (5-min cron)
- Auto-expires PENDING bookings (10-min cron)
- Validates business rules
- Manages state transitions
- Calculates fees and amounts

---

## Booking Creation Workflow

```
┌─────────────────────────────────────────────────────────────────────┐
│                    POST /pet-sitter-booking/create                  │
│                    (Requires PET_OWNER role)                        │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
              ┌───────────────────────────────────┐
              │ Step 1: Validate Input DTO         │
              ├───────────────────────────────────┤
              │ ✓ Service XOR Package (not both)   │
              │ ✓ Valid pet IDs (belong to owner)  │
              │ ✓ Booking time in future           │
              │ ✓ Service duration computed        │
              └───────────────────────────────────┘
                              │
                              ▼
              ┌───────────────────────────────────┐
              │ Step 2: Fetch & Validate           │
              │ - Pet owner (must be ACTIVE)       │
              │ - Pet profiles (must own pets)     │
              │ - Service/Package (must exist)     │
              │ - Pet sitter (must be ACTIVE)      │
              └───────────────────────────────────┘
                              │
                              ▼
              ┌───────────────────────────────────┐
              │ Step 3: Calculate Totals           │
              ├───────────────────────────────────┤
              │ • Base price from service/package  │
              │ • Additional service prices        │
              │ • Duration in minutes computed     │
              │ • Duration = from start time +     │
              │   service duration + addl duration │
              │ • Finishing time = start + duration│
              │ • Platform fee (from settings)     │
              │ • Grand total = price + fee        │
              └───────────────────────────────────┘
                              │
                              ▷ If PACKAGE booking with additional services:
                              │  - Validate max 3 additional services
                              │  - Check services belong to same sitter
                              │  - Check not already in package
                              │  - Add prices and durations
                              │
                              ▼
              ┌───────────────────────────────────┐
              │ Step 4: Resolve Location           │
              ├───────────────────────────────────┤
              │ If isOwnHome = true:               │
              │  → Use pet owner's address         │
              │  → Format: street, city, postal    │
              │ Else:                              │
              │  → Use pet sitter's address        │
              │  → Format: street, city, country   │
              └───────────────────────────────────┘
                              │
                              ▼
              ┌───────────────────────────────────┐
              │ Step 5: Start Transaction          │
              │ (Atomic database operation)        │
              └───────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
                    ▼                   ▼
        ┌──────────────────┐   ┌──────────────────┐
        │ Check Conflicts  │   │ Generate Booking │
        │                  │   │ Unique ID        │
        │ • Overlap check: │   │                  │
        │   Sitter's other │   │ Format: B + 13-  │
        │   CONFIRMED/     │   │ digit timestamp  │
        │   IN_PROGRESS/   │   │ Retry 5 times if │
        │   LATE bookings  │   │ P2002 (unique)   │
        │   in same time   │   │ constraint       │
        │ • Must NOT       │   │ violation        │
        │   overlap        │   │                  │
        └──────────────────┘   └──────────────────┘
                    │                   │
                    └─────────┬─────────┘
                              │
                              ▼
              ┌───────────────────────────────────┐
              │ Step 6: Create Booking Record      │
              ├───────────────────────────────────┤
              │ PetSitterBooking.create {          │
              │   bookingId: generated ID          │
              │   clientId: userId                 │
              │   petSitterProfileId:              │
              │   status: PENDING                  │
              │   startingTime                     │
              │   finishingTime                    │
              │   price: totalAmount               │
              │   platformFee: PLATFORM_FEE        │
              │   grandTotal                       │
              │   location: resolved address       │
              │   isOwnHome: boolean               │
              │   durationInMinutes                │
              │   specialInstructions: optional    │
              │   bookingType: SERVICE|PACKAGE     │
              │   packageId/serviceId: optional    │
              │   pets: [ {petId}, ... ]           │
              │ }                                  │
              └───────────────────────────────────┘
                              │
                              │ If additional services:
                              ▼
              ┌───────────────────────────────────┐
              │ Create Additional Services Links   │
              ├───────────────────────────────────┤
              │ PetSitterBookingAdditionalService │
              │ .createMany {                      │
              │   {bookingId, serviceId: id1},    │
              │   {bookingId, serviceId: id2},    │
              │   ...                             │
              │ }                                  │
              └───────────────────────────────────┘
                              │
                              ▼
              ┌───────────────────────────────────┐
              │ Step 7: Commit Transaction         │
              └───────────────────────────────────┘
                              │
                              ▼
              ┌───────────────────────────────────┐
              │ Return Success Response            │
              ├───────────────────────────────────┤
              │ {                                 │
              │   id: booking.id                  │
              │   bookingId: booking.bookingId    │
              │   status: PENDING                 │
              │   startingTime                    │
              │   finishingTime                   │
              │   price                           │
              │   grandTotal                      │
              │   platformFee                     │
              │   location                        │
              │   petSitterId                     │
              │   additionalServiceIds            │
              │ }                                 │
              └───────────────────────────────────┘
```

### Key Validations During Creation:

| Validation             | Rule                          | Error                                        |
| ---------------------- | ----------------------------- | -------------------------------------------- |
| Service XOR Package    | Can't book both               | "Can't book both service and package"        |
| Service/Package exists | Must not be null              | "Service/Package not found or unavailable"   |
| Pet ownership          | All pets must belong to owner | "Some pet IDs are invalid for this owner"    |
| Sitter active          | Pet sitter must be ACTIVE     | "Pet sitter profile not found or inactive"   |
| Not on vacation        | Sitter can't be ON_VACATION   | "Pet sitter is on vacation..."               |
| Booking time future    | Start time must be > now      | "Booking time must be in the future"         |
| No overlaps            | Sitter must be free           | "Pet sitter is already booked for this time" |

---

## Booking Confirmation Workflow

```
┌──────────────────────────────────────────────────────────────────┐
│        PATCH /pet-sitter-booking/{id}/confirm                    │
│        (Requires PET_SITTER role)                                │
└──────────────────────────────────────────────────────────────────┘
                        │
                        ▼
        ┌──────────────────────────────┐
        │ Step 1: Validate Sitter      │
        ├──────────────────────────────┤
        │ ✓ Sitter exists              │
        │ ✓ Sitter ACTIVE              │
        │ ✓ Profile ACTIVE             │
        │ ✓ Not on VACATION            │
        └──────────────────────────────┘
                        │
                        ▼
        ┌──────────────────────────────┐
        │ Step 2: Check for Conflicts  │
        ├──────────────────────────────┤
        │ • No other IN_PROGRESS       │
        │   bookings (one per sitter)  │
        │ • Fetch booking to confirm   │
        │ • Must be in PENDING status  │
        │ • Check no overlaps          │
        └──────────────────────────────┘
                        │
                        ▼
        ┌──────────────────────────────┐
        │ Step 3: Verify Status Valid  │
        ├──────────────────────────────┤
        │ Can't confirm from:          │
        │ ✗ CONFIRMED                  │
        │ ✗ IN_PROGRESS                │
        │ ✗ CANCELLED                  │
        │ ✗ REQUEST_TO_COMPLETE        │
        │ ✗ COMPLETED                  │
        │ ✗ EXPIRED                    │
        └──────────────────────────────┘
                        │
                        ▼
        ┌──────────────────────────────┐
        │ Step 4: Atomic Confirmation  │
        │ (Database transaction)       │
        ├──────────────────────────────┤
        │ Update WHERE:                │
        │ • id = bookingId             │
        │ • status = PENDING           │
        │ • No overlapping confirmed/  │
        │   in-progress bookings       │
        │                              │
        │ SET: status = CONFIRMED      │
        └──────────────────────────────┘
                        │
                        ▼
        ┌──────────────────────────────┐
        │ Step 5: Return Result        │
        ├──────────────────────────────┤
        │ Success message or error if: │
        │ • Booking not found          │
        │ • Already confirmed          │
        │ • Overlapping booking exists │
        └──────────────────────────────┘
```

**Important Notes:**

- Sitter must be in ACTIVE profile state
- Can't confirm during vacation
- Automatically becomes LATE if not marked IN_PROGRESS by start time (cron job)
- Max 1 PENDING → CONFIRMED per sitter (though multiple can be confirmed across time)

---

## In-Progress & Completion Flow

### A. Starting Service (CONFIRMED → IN_PROGRESS)

```
┌──────────────────────────────────────────────────────────────────┐
│      PATCH /pet-sitter-booking/{id}/mark-as-in-progress          │
│      (Requires PET_SITTER role)                                  │
└──────────────────────────────────────────────────────────────────┘
                        │
                        ▼
        ┌──────────────────────────────┐
        │ Step 1: Validate Sitter      │
        ├──────────────────────────────┤
        │ ✓ Sitter ACTIVE              │
        │ ✓ Profile ACTIVE             │
        └──────────────────────────────┘
                        │
                        ▼
        ┌──────────────────────────────┐
        │ Step 2: Check Constraint     │
        │ "Only 1 booking IN_PROGRESS" │
        ├──────────────────────────────┤
        │ • Find any existing          │
        │   IN_PROGRESS booking        │
        │ • If found: ERROR             │
        │ • Otherwise: proceed          │
        └──────────────────────────────┘
                        │
                        ▼
        ┌──────────────────────────────┐
        │ Step 3: Fetch Booking        │
        ├──────────────────────────────┤
        │ • Must exist                 │
        │ • Must be CONFIRMED status   │
        │ • Get startingTime, isLate   │
        └──────────────────────────────┘
                        │
                        ▼
        ┌──────────────────────────────┐
        │ Step 4: Grace Period Check   │
        ├──────────────────────────────┤
        │ GRACE_PERIOD = 10 minutes    │
        │ allowedStartTime =           │
        │   startingTime - 10 minutes  │
        │                              │
        │ if now < allowedStartTime:   │
        │   ERROR: Can't start yet     │
        │   Msg: "Can only start       │
        │        within 10 mins of     │
        │        scheduled time"       │
        └──────────────────────────────┘
                        │
                        ▼
        ┌──────────────────────────────┐
        │ Step 5: Calculate Late Time  │
        ├──────────────────────────────┤
        │ If booking.isLate = true:    │
        │   minutesLate =              │
        │     Math.floor(               │
        │       (now - startingTime) / │
        │       60000                  │
        │     )                        │
        │ Else: minutesLate = null     │
        └──────────────────────────────┘
                        │
                        ▼
        ┌──────────────────────────────┐
        │ Step 6: Update Booking       │
        ├──────────────────────────────┤
        │ SET:                         │
        │ • status = IN_PROGRESS       │
        │ • minutesLate = calculated   │
        │   (if late)                  │
        │                              │
        │ WHERE:                       │
        │ • id = bookingId             │
        └──────────────────────────────┘
                        │
                        ▼
        ┌──────────────────────────────┐
        │ Step 7: Update Sitter Status │
        ├──────────────────────────────┤
        │ PetSitterProfile.update:     │
        │ • status = ON_SERVICE        │
        │                              │
        │ (Signals sitter is busy)     │
        └──────────────────────────────┘
                        │
                        ▼
        ┌──────────────────────────────┐
        │ Return Success Response      │
        │ "Booking marked as          │
        │  in progress"                │
        └──────────────────────────────┘
```

**Grace Period Explanation:**

- Service can start 10 minutes EARLY
- Example: Booking at 10:00 AM can be started at 9:50 AM
- Must be started within 10 minutes AFTER scheduled time (enforced by LATE marking)

---

### B. Requesting Completion (IN_PROGRESS → REQUEST_TO_COMPLETE)

```
┌──────────────────────────────────────────────────────────────────┐
│    POST /pet-sitter-booking/{id}/request-to-complete             │
│    (Multipart form: files[] + completionNote)                    │
│    (Requires PET_SITTER role)                                    │
└──────────────────────────────────────────────────────────────────┘
                        │
                        ▼
        ┌──────────────────────────────┐
        │ Step 1: Validate Files       │
        ├──────────────────────────────┤
        │ ✗ No files: ERROR            │
        │ "Completion proof required"  │
        │ (Proof is MANDATORY)         │
        │ ✓ Files exist: continue      │
        └──────────────────────────────┘
                        │
                        ▼
        ┌──────────────────────────────┐
        │ Step 2: Upload to Cloudinary │
        ├──────────────────────────────┤
        │ cloudinary.uploadMultiple()  │
        │ • Upload each file           │
        │ • Get secure_url for each    │
        │ • Handle failures            │
        │ • Return URL array           │
        └──────────────────────────────┘
                        │
                        ▼
        ┌──────────────────────────────┐
        │ Step 3: Validate Sitter      │
        ├──────────────────────────────┤
        │ ✓ Sitter ACTIVE              │
        │ ✓ Profile ACTIVE             │
        │ ✗ Else: ERROR                │
        └──────────────────────────────┘
                        │
                        ▼
        ┌──────────────────────────────┐
        │ Step 4: Update Booking       │
        ├──────────────────────────────┤
        │ WHERE:                       │
        │ • id = bookingId             │
        │ • petSitterProfileId = sitter│
        │ • status = IN_PROGRESS       │
        │ (must be in progress)        │
        │                              │
        │ SET:                         │
        │ • status =                   │
        │   REQUEST_TO_COMPLETE        │
        │ • completionProof = URLs[]   │
        │ • completionNote = note      │
        │ • requestCompletedAt = now   │
        └──────────────────────────────┘
                        │
                        ▼
        ┌──────────────────────────────┐
        │ Step 5: Return Result        │
        ├──────────────────────────────┤
        │ Success or error if:         │
        │ • Booking not found          │
        │ • Not IN_PROGRESS            │
        │ • Upload failed              │
        └──────────────────────────────┘

        📌 RESPONSE EXAMPLE:
        {
          "status": "REQUEST_TO_COMPLETE",
          "completionProof": [
            "https://cloudinary.../image1.jpg",
            "https://cloudinary.../video1.mp4"
          ],
          "completionNote": "All pets happy and well-fed!",
          "requestCompletedAt": "2026-02-14T10:45:00Z"
        }
```

**Completion Proof Storage:**

- URLs stored in `completionProof` array (PostgreSQL TEXT[])
- Multiple files supported (photos, videos, etc.)
- Hosted on Cloudinary (permanent storage)
- Cannot proceed to COMPLETED without proof

---

### C. Approving Completion (REQUEST_TO_COMPLETE → COMPLETED)

```
┌──────────────────────────────────────────────────────────────────┐
│      PATCH /pet-sitter-booking/{id}/complete                     │
│      (Requires PET_OWNER role)                                   │
└──────────────────────────────────────────────────────────────────┘
                        │
                        ▼
        ┌──────────────────────────────┐
        │ Step 1: Validate Owner       │
        ├──────────────────────────────┤
        │ ✓ User ACTIVE                │
        │ ✓ Role = PET_OWNER           │
        │ ✗ Else: ERROR                │
        └──────────────────────────────┘
                        │
                        ▼
        ┌──────────────────────────────┐
        │ Step 2: Fetch Booking        │
        ├──────────────────────────────┤
        │ WHERE:                       │
        │ • id = bookingId             │
        │ • clientId = userId          │
        │ • status =                   │
        │   REQUEST_TO_COMPLETE        │
        │ (owner must match)           │
        └──────────────────────────────┘
                        │
                        ▼
        ┌──────────────────────────────┐
        │ Step 3: Start Transaction    │
        └──────────────────────────────┘
                        │
                ┌─────────┴─────────┐
                │                   │
                ▼                   ▼
        ┌──────────────┐    ┌──────────────────┐
        │ Complete     │    │ Reset Sitter     │
        │ Booking      │    │ Availability     │
        │              │    │                  │
        │ SET:         │    │ PetSitterProfile │
        │ • status =   │    │ .update:         │
        │   COMPLETED  │    │ • status =       │
        │ • completedAt│    │   OFF_SERVICE    │
        │   = now      │    │ (back to idle)   │
        └──────────────┘    └──────────────────┘
                │                   │
                └─────────┬─────────┘
                          │
                          ▼
        ┌──────────────────────────────┐
        │ Commit Transaction           │
        └──────────────────────────────┘
                        │
                        ▼
        ┌──────────────────────────────┐
        │ Return Success Response      │
        │ "Booking completed          │
        │  successfully"               │
        └──────────────────────────────┘
```

**After Completion:**

- Booking transitions to COMPLETED (final state)
- Sitter returns to OFF_SERVICE (available for new bookings)
- Payment processing occurs (if payment module integrated)
- Owner can now leave reviews

---

## Cancellation Rules

### Cancellation Constraints

| State               | Can Cancel? | Who Can Cancel        | Result             |
| ------------------- | ----------- | --------------------- | ------------------ |
| PENDING             | ✅ YES      | Pet Owner, Pet Sitter | → CANCELLED        |
| CONFIRMED           | ❌ NO       | N/A                   | Blocked with error |
| IN_PROGRESS         | ❌ NO       | N/A                   | Blocked with error |
| LATE                | ❌ NO       | N/A                   | Blocked with error |
| REQUEST_TO_COMPLETE | ❌ NO       | N/A                   | Blocked with error |
| COMPLETED           | ❌ NO       | N/A                   | Blocked with error |
| CANCELLED           | ❌ NO       | N/A                   | Already cancelled  |
| EXPIRED             | ❌ NO       | N/A                   | Already expired    |

```
┌──────────────────────────────────────────────────────────────────┐
│     DELETE /pet-sitter-booking/{id}/cancel                       │
│     (Requires PET_OWNER or PET_SITTER role)                      │
└──────────────────────────────────────────────────────────────────┘
                        │
                        ▼
        ┌──────────────────────────────┐
        │ Step 1: Validate User        │
        ├──────────────────────────────┤
        │ ✓ User ACTIVE                │
        │ ✓ User exists                │
        │ Get user role                │
        └──────────────────────────────┘
                        │
                        ▼
        ┌──────────────────────────────┐
        │ Step 2: Identify Role        │
        ├──────────────────────────────┤
        │ If role = PET_SITTER:        │
        │  Fetch petSitterProfileId    │
        │  Add to OR conditions        │
        │ Else: (PET_OWNER)            │
        │  Use clientId condition      │
        └──────────────────────────────┘
                        │
                        ▼
        ┌──────────────────────────────┐
        │ Step 3: Build Safe WHERE     │
        ├──────────────────────────────┤
        │ WHERE MUST ALL BE TRUE:      │
        │ • id = bookingId             │
        │ • status = PENDING           │
        │ • (clientId = userId OR      │
        │    petSitterProfileId =      │
        │    sitterId)                 │
        │                              │
        │ (atomic check - prevents     │
        │  invalid cancellations)      │
        └──────────────────────────────┘
                        │
                        ▼
        ┌──────────────────────────────┐
        │ Step 4: Atomic Cancellation  │
        ├──────────────────────────────┤
        │ updateMany{                  │
        │   where: {...},              │
        │   data: {                    │
        │     status: CANCELLED,       │
        │     cancelledByUserId,       │
        │     cancelledByRole,         │
        │     cancelledAt: now         │
        │   }                          │
        │ }                            │
        │                              │
        │ Returns: {count: 0 or 1}     │
        └──────────────────────────────┘
                        │
                        ▼
        ┌──────────────────────────────┐
        │ Step 5: Check Result         │
        ├──────────────────────────────┤
        │ if count === 0:              │
        │   ERROR: Not allowed or      │
        │          not PENDING         │
        │ if count === 1:              │
        │   SUCCESS: Cancelled         │
        └──────────────────────────────┘
                        │
                        ▼
        ┌──────────────────────────────┐
        │ Return Response              │
        │ "Booking cancelled          │
        │  successfully"               │
        └──────────────────────────────┘
```

**Cancellation Tracking:**

```javascript
{
  status: "CANCELLED",
  cancelledByUserId: "user-uuid",      // Who cancelled
  cancelledByRole: "PET_OWNER",        // Their role (enum)
  cancelledAt: "2026-02-14T09:00:00Z"  // When cancelled
}
```

---

## Automated Processes (Cron Jobs)

The system uses NestJS `@Cron` decorators for automated background tasks. All cron jobs are defined in [cron-job.service.ts](../src/common/job/cron-job.service.ts).

### 1. Late Booking Detection (Every 5 Minutes)

**Purpose**: Mark bookings LATE if scheduled time has passed without IN_PROGRESS status

```typescript
@Cron(CronExpression.EVERY_5_MINUTES)
async markLatePetSitterBookings() {
  // Find CONFIRMED bookings where startingTime < now
  const bookings = await this.petSitterBooking.findMany({
    where: {
      status: 'CONFIRMED',
      startingTime: { lt: now },
      isLate: false,
    },
    select: { id: true },
    take: 500, // Max 500 per run
  });

  // Update in batches of 50
  for (let i = 0; i < bookings.length; i += BATCH_SIZE) {
    const batch = bookings.slice(i, i + BATCH_SIZE);
    await updateMany({
      where: { id: { in: batch.map(b => b.id) } },
      data: { status: 'LATE', isLate: true },
    });
    logger.log(`Marked ${result.count} bookings as LATE`);
  }
}
```

**Details:**

- Condition: `status = CONFIRMED` AND `startingTime < now` AND `isLate = false`
- Action: Update to `status = LATE, isLate = true`
- Batch size: 50 per database transaction
- Max per run: 500 bookings
- Frequency: Every 5 minutes

#### Grace Period Timeline:

```
09:50 AM ─► Sitter can start (grace starts: -10 min)
10:00 AM ─► Scheduled start time
10:10 AM ─► Grace period ends (+10 min)
10:10:01 ─► NEXT CRON RUN (within 5 min)
10:15 AM ─► Definitely marked LATE by now
```

---

### 2. Pending Booking Expiration (Every 10 Minutes)

**Purpose**: Auto-expire PENDING bookings that weren't confirmed in time

```typescript
@Cron(CronExpression.EVERY_10_MINUTES)
async expirePendingBookings() {
  const GRACE_MS = 15 * 60 * 1000; // 15 minutes
  const cutoff = new Date(now.getTime() - GRACE_MS);

  // Find expired PENDING bookings
  const bookings = await this.petSitterBooking.findMany({
    where: {
      status: 'PENDING',
      startingTime: { lt: cutoff },
    },
    select: { id: true },
    take: 500, // Max 500 per run
  });

  // Update in batches of 50
  for (let i = 0; i < bookings.length; i += BATCH_SIZE) {
    const batch = bookings.slice(i, i + BATCH_SIZE);
    await updateMany({
      where: { id: { in: batch.map(b => b.id) } },
      data: { status: 'EXPIRED' },
    });
    logger.log(`Expired ${result.count} pending bookings`);
  }
}
```

**Details:**

- Condition: `status = PENDING` AND `startingTime < (now - 15 minutes)`
- Grace period: 15 minutes from scheduled start time
- Action: Update to `status = EXPIRED`
- Batch size: 50 per transaction
- Max per run: 500 bookings
- Frequency: Every 10 minutes

#### Grace Period Timeline:

```
Booking created: 09:45 AM for 10:00 AM start
09:45 - 10:00 AM: PENDING (sitter has 15 minutes to confirm)
10:00 AM: Sitter must confirm within 15 mins
         If not, at next cron:
10:10 AM: NEXT CRON RUN
         Booking marked EXPIRED
```

---

### 3. Story Expiration (Every 5 Minutes)

**Purpose**: Automatically expire/archive stories after 24 hours

```typescript
@Cron(CronExpression.EVERY_5_MINUTES)
async expireStories() {
  const stories = await this.story.findMany({
    where: {
      expiresAt: { lt: now },
      isPublished: true,
      isDeleted: false,
    },
    select: { id: true, userId: true },
  });

  for (let i = 0; i < stories.length; i += BATCH_SIZE) {
    const batch = stories.slice(i, i + BATCH_SIZE);
    await tx.$transaction(async (tx) => {
      // Mark as not published
      await tx.story.updateMany({
        where: { id: { in: batch.map(s => s.id) } },
        data: { isPublished: false },
      });

      // Create moment archive entries
      await tx.moment.createMany({
        data: batch.map(s => ({
          storyId: s.id,
          userId: s.userId,
        })),
        skipDuplicates: true,
      });
    });
  }
}
```

---

### 4. User Suspension Expiration (Every 5 Minutes)

**Purpose**: Automatically lift suspensions after suspension period ends

```typescript
@Cron(CronExpression.EVERY_5_MINUTES)
async suspendUserExpiration() {
  const result = await this.user.updateMany({
    where: {
      status: 'SUSPENDED',
      suspendUntil: { not: null, lt: new Date() },
    },
    data: {
      status: 'ACTIVE',
      suspendUntil: null,
      suspendReason: null,
    },
  });

  if (result.count > 0) {
    this.logger.log(`Reactivated ${result.count} suspended users`);
  }
}
```

---

### 5. Trending Score Calculation (Hourly & Daily)

**Hourly** (Every hour):

- Recently active posts/reels (last 3 days)
- Calculates engagement-based trending scores
- Applies base score to new content

**Daily** (Every day at midnight):

- All posts/reels
- Resets inactive content to 0

See [cron-job.service.ts](../src/common/job/cron-job.service.ts#updateTrendingScore) for implementation.

---

## Database Schema

### Core Booking Model

```prisma
model PetSitterBooking {
  // Identifiers
  id          String @id @default(uuid())
  bookingId   String @unique              // User-facing ID

  // State & Status
  status      PetSitterBookingStatus @default(PENDING)
  bookingType BookingType
  isLate      Boolean @default(false)
  minutesLate Int? @default(0)

  // Time Fields
  startingTime  DateTime
  finishingTime DateTime?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  // Location
  isOwnHome Boolean @default(false)
  location  String @default("")

  // Financial
  price       Int                    // Service/Package price
  platformFee Int                    // Platform fee
  grandTotal  Int                    // price + platformFee
  paymentId   String?                // Link to Payment

  // Content
  specialInstructions String?
  durationInMinutes   Int?

  // Service/Package Selection
  packageId String?
  serviceId String?

  // Completion
  completionProof    String[]          // URLs to Cloudinary media
  completionNote     String?
  completedAt        DateTime?
  requestCompletedAt DateTime?

  // Cancellation Tracking
  cancelledByUserId String?
  cancelledByRole   ProfileType?      // ENUM: PET_OWNER, PET_SITTER
  cancelledAt       DateTime?

  // Foreign Keys
  clientId           String            // Pet owner ID
  petSitterProfileId String            // Pet sitter profile ID

  // Relations
  user              User              @relation(fields: [clientId], references: [id])
  petSitter         PetSitterProfile  @relation(fields: [petSitterProfileId], references: [id])
  package           Package?          @relation(fields: [packageId], references: [id])
  service           Service?          @relation(fields: [serviceId], references: [id])
  cancelledByUser   User?             @relation("BookingCancelledByUser", fields: [cancelledByUserId], references: [id])

  // Junction Relations
  pets                               PetSitterBookingPet[]
  petSitterBookingAdditionalServices PetSitterBookingAdditionalService[]
  payments                           Payment[]

  // Indexes for performance
  @@index([clientId])
  @@index([petSitterProfileId])
  @@index([status])
  @@index([startingTime])
  @@index([createdAt])
}

// Junction table: Booking ← → Pet
model PetSitterBookingPet {
  petSitterBookingId String
  petId              String

  petSitterBooking PetSitterBooking @relation(fields: [petSitterBookingId], references: [id])
  pet              PetProfile       @relation(fields: [petId], references: [id])

  @@unique([petSitterBookingId, petId])
}

// Junction table: Booking ← → Additional Service
model PetSitterBookingAdditionalService {
  petSitterBookingId  String
  additionalServiceId String

  petSitterBooking  PetSitterBooking @relation(fields: [petSitterBookingId], references: [id])
  additionalService Service          @relation(fields: [additionalServiceId], references: [id])

  @@unique([petSitterBookingId, additionalServiceId])
}

// Enums
enum BookingType {
  PACKAGE
  SERVICE
}

enum PetSitterBookingStatus {
  PENDING
  CONFIRMED
  IN_PROGRESS
  LATE
  REQUEST_TO_COMPLETE
  COMPLETED
  CANCELLED
  EXPIRED
}
```

### Related Models

**Service:**

```prisma
model Service {
  id                 String
  name               String
  description        String
  durationInMinutes  Int
  price              Decimal
  isAvailable        Boolean
  thumbnailImage     String
  petSitterId        String
  // ... other fields
  petSitterBookings  PetSitterBooking[]
}

model Package {
  id                 String
  name               String
  durationInMinutes  Int
  calculatedPrice    Decimal
  offeredPrice       Decimal
  petSitterId        String
  // ... other fields
  petSitterBookings  PetSitterBooking[]
  packageServices    PackageService[]
}
```

---

## API Endpoints

### Create Booking

```
POST /pet-sitter-booking/create
Role: PET_OWNER
Content-Type: application/json

Body:
{
  "petIds": ["uuid-1", "uuid-2"],
  "bookingTime": "2026-02-20T10:00:00Z",
  "serviceId": "service-uuid",           // OR
  "packageId": "package-uuid",           // OR
  "bookingType": "SERVICE",              // or "PACKAGE"
  "isOwnHome": true,                     // true: owner's home, false: sitter's location
  "specialInstructions": "Mild allergies",
  "additionalServices": ["svc-1", "svc-2"]  // Optional (max 3)
}

Response (201 Created):
{
  "id": "booking-uuid",
  "bookingType": "SERVICE",
  "status": "PENDING",
  "startingTime": "2026-02-20T10:00:00Z",
  "finishingTime": "2026-02-20T11:00:00Z",
  "price": 50,
  "grandTotal": 55,
  "platformFee": 5,
  "location": "123 Main St, Brooklyn, NY, 11218",
  "petIds": ["uuid-1", "uuid-2"],
  "petSitterId": "sitter-profile-uuid",
  "bookingId": "B1739517145678",
  "additionalServiceIds": ["svc-1"]
}
```

---

### Confirm Booking (Sitter)

```
PATCH /pet-sitter-booking/{bookingId}/confirm
Role: PET_SITTER
Authorization: Bearer token

Response (200 OK):
{
  "message": "You have successfully confirmed this booking"
}
```

---

### Mark as In Progress (Sitter)

```
PATCH /pet-sitter-booking/{bookingId}/mark-as-in-progress
Role: PET_SITTER
Authorization: Bearer token

Response (200 OK):
{
  "message": "Booking marked as in progress"
}
```

---

### Request to Complete (Sitter)

```
POST /pet-sitter-booking/{bookingId}/request-to-complete
Role: PET_SITTER
Content-Type: multipart/form-data

Body:
{
  "files": [File, File, ...],           // Photos/videos required
  "completionNote": "All pets happy!"   // Optional, max 500 chars
}

Response (200 OK):
{
  "message": "Booking marked as request to complete"
}
```

---

### Complete Booking (Owner)

```
PATCH /pet-sitter-booking/{bookingId}/complete
Role: PET_OWNER
Authorization: Bearer token

Response (200 OK):
{
  "message": "Booking completed successfully"
}
```

---

### Cancel Booking

```
DELETE /pet-sitter-booking/{bookingId}/cancel
Role: PET_OWNER or PET_SITTER
Authorization: Bearer token

Response (200 OK):
{
  "message": "Booking cancelled successfully"
}

Error (400 Bad Request):
{
  "message": "Booking not found, already processed, or you are not allowed to cancel it"
}
```

---

### Get My Bookings (Pet Owner)

```
GET /pet-sitter-booking/pet-owner/my-bookings
  ?limit=20
  &cursor={id}
  &status=CONFIRMED
  &bookingType=SERVICE
  &search=dog+walking
Role: PET_OWNER

Response (200 OK):
{
  "data": [
    {
      "id": "booking-uuid",
      "bookingId": "B1739517145678",
      "bookingStatus": "CONFIRMED",
      "status": "CONFIRMED",
      "bookingType": "SERVICE",
      "image": "https://cloudinary.../service.jpg",
      "price": 50,
      "grandTotal": 55,
      "platformFee": 5,
      "petSitter": {
        "id": "sitter-profile-id",
        "name": "John Doe",
        "image": "https://cloudinary.../john.jpg",
        "averageRating": 4.8
      },
      "location": "123 Main St, Brooklyn",
      "servicesInPackage": [
        { "serviceName": "Dog Walking" },
        { "serviceName": "Feeding" }
      ],
      "cancelInfo": null
    }
  ],
  "nextCursor": "cursor-for-next-page"
}
```

---

### Get My Bookings (Pet Sitter)

```
GET /pet-sitter-booking/pet-sitter/my-bookings
  ?limit=20
  &cursor={id}
  &status=CONFIRMED
  &bookingType=SERVICE
Role: PET_SITTER

Response (200 OK):
{
  "data": [
    {
      "id": "booking-uuid",
      "bookingId": "B1739517145678",
      "bookingStatus": "CONFIRMED",
      "bookingType": "SERVICE",
      "image": "https://cloudinary.../service.jpg",
      "price": 50,
      "grandTotal": 55,
      "platformFee": 5,
      "petOwnerName": "Jane Smith",
      "dateTime": "2026-02-20T10:00:00Z",
      "pets": [
        {
          "name": "Buddy",
          "image": "https://cloudinary.../buddy.jpg",
          "age": 3
        }
      ],
      "servicesInPackage": [],
      "cancelInfo": null
    }
  ],
  "nextCursor": "cursor-for-next-page"
}
```

---

### Get Booking Details

```
GET /pet-sitter-booking/{bookingId}
Authorization: Bearer token

Response (200 OK):
{
  "id": "booking-uuid",
  "name": "Dog Walking Service",
  "image": "https://cloudinary.../service.jpg",
  "bookingType": "SERVICE",
  "status": "IN_PROGRESS",
  "startTime": "2026-02-20T10:00:00Z",
  "endTime": "2026-02-20T11:00:00Z",
  "durationInMinutes": 60,
  "location": "123 Main St, Brooklyn, NY, 11218",
  "isOwnHome": true,
  "price": 50,
  "platformFee": 5,
  "grandTotal": 55,
  "bookingId": "B1739517145678",
  "specialInstructions": "Mild allergies to chicken",
  "petSitter": {
    "id": "sitter-profile-id",
    "userId": "user-uuid",
    "name": "John Doe",
    "image": "https://cloudinary.../john.jpg"
  },
  "pets": [
    {
      "petId": "pet-uuid",
      "name": "Buddy",
      "image": "https://cloudinary.../buddy.jpg",
      "age": 3
    }
  ],
  "includedServices": [
    { "serviceId": "svc-uuid", "name": "Dog Walking" },
    { "serviceId": "svc-uuid", "name": "Feeding" }
  ],
  "additionalServices": [
    { "serviceId": "svc-uuid", "name": "Training" }
  ],
  "cancelInfo": null,
  "completionInfo": {
    "completionNote": "All pets happy and healthy!",
    "completionProof": [
      "https://cloudinary.../photo1.jpg",
      "https://cloudinary.../photo2.jpg"
    ],
    "completedAt": "2026-02-20T11:30:00Z",
    "requestCompletedAt": "2026-02-20T11:15:00Z"
  }
}
```

---

## Error Handling & Validations

### Input Validations

| Endpoint         | Field                | Rule                     | Error Message                                    |
| ---------------- | -------------------- | ------------------------ | ------------------------------------------------ |
| Create           | serviceId, packageId | One required, not both   | "You cannot book both service and package"       |
| Create           | petIds               | Non-empty array          | "Pets array cannot be empty"                     |
| Create           | bookingTime          | Future date              | "Booking time must be in the future"             |
| Create           | serviceId            | Must exist & available   | "Service not found or unavailable"               |
| Create           | packageId            | Must exist               | "Package not found"                              |
| Create           | petIds               | All must belong to owner | "Some pet IDs are invalid for this owner"        |
| Request Complete | files                | At least 1 file          | "No files provided for upload"                   |
| Request Complete | completionNote       | Max 500 chars            | "Completion note exceeds 500 characters"         |
| Create (Add Svc) | additionalServices   | Max 3 items              | "You can add a maximum of 3 additional services" |

### Business Logic Validations

| Scenario         | Validation                        | Error                                                                              |
| ---------------- | --------------------------------- | ---------------------------------------------------------------------------------- |
| Create Booking   | Sitter on vacation                | "Pet sitter is on vacation and cannot accept bookings"                             |
| Create Booking   | Pet sitter not ACTIVE             | "Pet sitter profile not found or inactive"                                         |
| Create Booking   | Pet owner not ACTIVE              | "User not found or inactive"                                                       |
| Create Booking   | Overlapping time slot             | "The pet sitter is already booked for this time"                                   |
| Confirm          | Sitter has IN_PROGRESS            | "You already have a booking in progress"                                           |
| Confirm          | Overlapping confirmed/in-progress | "Cannot confirm booking: overlapping confirmed/in-progress booking exists"         |
| Mark In Progress | Grace period violated             | "You can only start this booking within 10 minutes of the scheduled time"          |
| Mark In Progress | Not in CONFIRMED state            | "Booking is not confirmed and cannot be started"                                   |
| Mark In Progress | Already IN_PROGRESS               | "You already have a booking in progress"                                           |
| Request Complete | Files not provided                | "No files provided for upload, completion proof is required"                       |
| Request Complete | Not IN_PROGRESS                   | "Booking not found, not in progress, or you are not allowed to request completion" |
| Complete         | User not PET_OWNER                | "User not found or not allowed"                                                    |
| Complete         | Not REQUEST_TO_COMPLETE           | "Booking not found, not requested for completion, or not allowed"                  |
| Cancel           | Not PENDING                       | "Booking not found, already processed, or you are not allowed to cancel it"        |

### Authentication & Authorization

All endpoints require:

- ✅ Valid JWT token (Bearer token in Authorization header)
- ✅ User must be ACTIVE (status = ACTIVE)
- ✅ User must have correct role:
  - `POST /create`: PET_OWNER
  - `/confirm`: PET_SITTER
  - `/mark-as-in-progress`: PET_SITTER
  - `/request-to-complete`: PET_SITTER
  - `/complete`: PET_OWNER
  - `/cancel`: PET_OWNER or PET_SITTER
  - `GET /pet-owner/*`: PET_OWNER
  - `GET /pet-sitter/*`: PET_SITTER

---

## Payment Integration

### Payment Flow

```
Booking created
    ↓
PENDING status
    ↓
Payment initiated (from frontend)
    ↓
Payment processingPaymentId stored in booking
    ↓
Booking confirmed by sitter
    ↓
Service delivered and completed
    ↓
Payment marked COMPLETED
```

### Payment Fields

```prisma
model PetSitterBooking {
  paymentId String?  // References Payment model
  ...
}

model Payment {
  id                String @id
  amount            Decimal
  petSitterBooking  PetSitterBooking @relation(fields: [bookingId])
  bookingId         String
  status            PaymentStatus  // PENDING, COMPLETED, FAILED, REFUNDED
  transactionId     String?
  ...
}
```

### Financial Breakdown

```
Example: Dog Walking (60 mins)
├─ Base Service Price: $50
├─ Additional Service (Training): $20
├─ Subtotal: $70
├─ Platform Fee: $5 (fixed)
└─ Grand Total: $75

Payment Calculation:
  price = 50 (or calculated from package)
  platformFee = getPlatformFeeFromSettings()
  grandTotal = price + platformFee
```

---

## Summary Table

| Aspect                     | Details                                                                                       |
| -------------------------- | --------------------------------------------------------------------------------------------- |
| **Booking Types**          | SERVICE, PACKAGE                                                                              |
| **Total States**           | 8 (PENDING, CONFIRMED, IN_PROGRESS, LATE, REQUEST_TO_COMPLETE, COMPLETED, CANCELLED, EXPIRED) |
| **Max Simultaneous**       | 1 per sitter (IN_PROGRESS constraint)                                                         |
| **Cancellation Window**    | PENDING only                                                                                  |
| **Grace Period (Start)**   | 10 minutes before scheduled time                                                              |
| **Grace Period (Confirm)** | 15 minutes from scheduled start                                                               |
| **Late Detection**         | Cron every 5 mins                                                                             |
| **Expiration Check**       | Cron every 10 mins                                                                            |
| **Storage**                | PostgreSQL + Cloudinary (proof media)                                                         |
| **Key Validations**        | Overlap check, availability, pet ownership, sitter status                                     |
| **Atomic Operations**      | Transaction wrappers for critical state changes                                               |

---

## Implementation Notes

### Performance Considerations

- Indexes on: `clientId`, `petSitterProfileId`, `status`, `startingTime`, `createdAt`
- Pagination support with cursor-based approach
- Batch processing in cron jobs (batches of 50, max 500/run)
- Lazy loading of related entities

### Security Considerations

- Role-based access control (RBAC)
- User validation before all operations
- Status-based state machine prevents invalid transitions
- Atomic transactions prevent race conditions
- File uploads to trusted Cloudinary storage

### Data Consistency

- Database transactions for multi-step operations
- Unique constraints on bookingId, pets-per-booking, services-per-booking
- Cascading deletes on profile/service deletion
- Soft deletes where applicable

---

## Contact & References

For questions about specific implementations, see:

- [pet-sitter-booking.service.ts](../src/modules/pet-sitter/pet-sitter-booking/pet-sitter-booking.service.ts)
- [pet-sitter-booking.controller.ts](../src/modules/pet-sitter/pet-sitter-booking/pet-sitter-booking.controller.ts)
- [cron-job.service.ts](../src/common/job/cron-job.service.ts)
- [schema.prisma](../prisma/schema.prisma)
