# Richardhan Project Overview

This document serves as a comprehensive overview of the full project, encompassing both the `richardhan-server` (backend) and `richardhan-web` (frontend) repositories.

---

## 🏗️ 1. Backend Architecture (`richardhan-server`)

The backend is a robust API built using **NestJS** and **Prisma ORM**, connecting to a PostgreSQL database. It is highly modular, role-based, and built to handle complex multi-sided marketplace interactions.

### Key Technologies:
- **Framework**: NestJS (Express under the hood)
- **Database**: PostgreSQL (managed via Prisma ORM)
- **Authentication**: JWT, NextAuth/Passport integrations, Google OAuth2, Firebase Admin (for mobile app/pet owner login)
- **Real-time**: `@nestjs/websockets` and `socket.io` for chat and notifications
- **Storage**: Cloudinary for image and media uploads
- **Email**: Nodemailer for OTPs and notifications

### Core Modules & Features:
1. **User & Authentication**:
   - Supports multiple roles: `ADMIN`, `PET_OWNER`, `PET_SITTER`, `PET_HOTEL`, `PET_SCHOOL`, and `VENDOR`.
   - Comprehensive login (Email/password, Google, Firebase) and role-specific profile initialization.
2. **Community & Social**:
   - Features social components like Posts, Reels, Stories, Comments, Likes, and Bookmarks.
   - Friendship handling, follow systems, and real-time chat (direct and group messaging).
3. **Services & Bookings**:
   - **Pet Sitters**: Can create packages, offer services with add-ons, and manage bookings.
   - **Pet Hotels**: Manage available rooms, food preferences, and hotel bookings.
   - **Pet Schools**: Manage courses, employee reviews, and training enrollment.
4. **E-commerce (Vendor)**:
   - Vendors can manage products, variants, attributes, inventory stock, and process orders.
5. **Administration & Safety**:
   - KYC verification for service providers.
   - Reporting system, user blocking/muting, and content hiding mechanisms.
   - Comprehensive Admin dashboard to view analytics across all user roles.
6. **Integrations**:
   - Stripe/Payment webhook configurations for handling transactions.

---

## 🖥️ 2. Frontend Architecture (`richardhan-web`)

The frontend is a modern web application built with **Next.js**, completely utilizing the **App Router** (`app/`) directory for routing and layouts.

### Key Technologies:
- **Framework**: Next.js 16 (React 19)
- **State Management & Data Fetching**: Redux Toolkit (RTK) with RTK Query (`@reduxjs/toolkit/query`) for efficient API caching.
- **Styling**: Tailwind CSS v4 alongside modular UI components.
- **Authentication**: NextAuth.js coupled with Redux state for JWT session persistence.
- **Animations & Icons**: Framer Motion and Lucide React.
- **Real-time**: `socket.io-client` for handling real-time chat and updates.

### Core Structure & Features:
1. **Routing (`app/`)**:
   - `(landingPage)`: Marketing and SEO-optimized public pages.
   - `(auth)`: Login, registration, OTP verification, and forgotten password flows.
   - `(profile-setup)`: Multi-step onboarding flows for capturing specific role details (e.g., Pet Sitter credentials, Vendor details).
   - `(dashboard)`: Role-gated dashboard interfaces providing rich analytics, service management, and booking overviews.
2. **Components (`components/`)**:
   - Reusable `ui` elements (buttons, inputs, modals).
   - Role-specific dashboard layouts, form handlers, and data visualization (Recharts).
3. **State Management (`redux/`)**:
   - `baseApi.ts` configured with automatic token injection and retry mechanics.
   - Domain-specific API slices for Dashboard stats, Profile updates, Vendor Inventory, Orders, KYC, and Chat.
4. **Contexts & Providers**:
   - Theme providers (light/dark mode support).
   - Socket providers to listen for incoming real-time events.

---

## 🚀 3. Current Development Status

- **Database**: The PostgreSQL database is successfully containerized via Docker (`docker-compose.db.yaml`).
- **Migrations & Seeding**: Prisma migrations are up to date, and initial seed data (Admin credentials, default configurations) have been applied.
- **Local Environment**: Local `.env` variables have been mapped properly so the Next.js frontend points securely to the NestJS backend at `http://localhost:5000/api`.
- Both servers are actively running in development mode, successfully compiling without errors and connecting securely to the database.
