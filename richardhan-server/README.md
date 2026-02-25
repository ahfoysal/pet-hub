# richardhan-server

A comprehensive pet services platform backend built with NestJS, Prisma, and PostgreSQL.

## Features

### Multi-Role System

- **Pet Owners**: Manage pet profiles, book services, purchase products
- **Pet Sitters**: Offer pet care services with custom packages and add-ons
- **Pet Schools**: Provide training courses with enrollment management
- **Pet Hotels**: Manage rooms, facilities, food services, and bookings
- **Vendors**: Sell pet products with variants and inventory management
- **Organizations**: KYC verification, employee management, analytics

### Core Functionality

- **E-commerce**: Product catalog, cart, orders, payment processing
- **Booking System**: Pet hotel rooms, pet sitter services, training courses
- **Social Features**: Posts, reels, stories, comments, likes, bookmarks
- **Messaging**: Direct conversations and community topics
- **Reviews & Ratings**: Organization and product reviews
- **Notifications**: Real-time updates for user activities
- **Payments**: Integrated payment system with platform fees
- **Reports**: Content moderation and user reporting

## Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT, Google OAuth, Email verification
- **File Upload**: Cloudinary integration
- **Email**: Nodemailer

## Getting Started

### Prerequisites

- Node.js
- PostgreSQL database

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file with the following variables:

```env
# Server Configuration
PORT=5000
FRONTEND_URL=http://localhost:3000

# Database Configuration (PostgreSQL)
DATABASE_URL="postgresql://user:password@localhost:5432/dbname?schema=public"

# JWT Authentication
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=1d
REFRESH_JWT_SECRET=your_refresh_token_secret_here
REFRESH_JWT_EXPIRES_IN=7d

# Cloudinary Storage
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Configuration (Nodemailer/SMTP)
EMAIL_USER=your_email@gmail.com
APP_PASS=your_app_specific_password

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
```

### Database Setup

```bash
# Run migrations
npx prisma migrate dev

# Seed database
npm run seed
```

### Run Application

#### Without Docker

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

#### With Docker

**Development mode** (with hot-reload):

```bash
# Start services
docker compose -f docker-compose.dev.yml up

# Stop services
docker compose -f docker-compose.dev.yml down
```

**Production mode**:

```bash
# Build and start services
docker compose up --build

# Start in detached mode
docker compose up -d

# View logs
docker compose logs -f

# Stop services
docker compose down

# Stop and remove volumes
docker compose down -v
```

## API Documentation

Swagger documentation available at `/api/docs` endpoint when running the server.

## Database Schema

The schema includes 50+ models covering:

- User management with role-based access
- Multi-vendor e-commerce
- Service bookings (hotels, sitters, schools)
- Social media features
- Payment and transaction handling
- KYC verification workflow

## License

UNLICENSED
