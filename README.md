# Vacation Request Management System

A full-stack web application for managing employee vacation requests with role-based access control. Built with React.js, Node.js, Express, and PostgreSQL.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Technical Choices](#technical-choices)
  - [Why These Technologies?](#why-these-technologies)
  - [Architecture Decisions](#architecture-decisions)
  - [Known Limitations](#known-limitations)
  - [Security Considerations](#security-considerations)

## Overview

This application provides two distinct interfaces for managing vacation requests:

1. **Requester Interface**: Allows employees to submit vacation requests and view their request history
2. **Validator Interface**: Allows managers to review, approve, or reject vacation requests

### Architecture Approach

The backend acts as a REST API that communicates with a PostgreSQL database using Prisma ORM. The overall schema and structure follows Prisma's schema design with users having different roles (REQUESTER and VALIDATOR) and vacation requests. Each requester can only see their own requests, while validators can see all available requests in the system.

Authentication is handled through JWT tokens for basic authentication, while roles provide basic authorization. The frontend stores the JWT token in localStorage and includes it in all backend requests for validation. The application uses separate dashboards for each role, utilizing component-based programming and code reusability where needed, with basic CSS for styling.

The application implements JWT-based authentication, role-based access control, and comprehensive validation on both client and server sides to ensure data integrity and security.

## Features

### Requester Features

- Submit vacation requests with start date, end date, and optional reason
- View personal vacation request history with status tracking
- Filter requests by status (Pending, Approved, Rejected)
- View rejection comments

### Validator Features

- View all vacation requests across all users
- Filter requests by status
- Approve requests
- Reject requests with optional feedback comments
- Extra: Search requests by user name (with debounce for better performance)

### Security & Performance

- JWT-based authentication with secure password hashing (bcrypt)
- Passwords never exposed in API responses
- Role-based access control (REQUESTER/VALIDATOR)
- Rate limiting to prevent abuse (100 req/15min general, 5 req/15min auth)
- Input validation (client-side and server-side)
- CORS protection
- Error handling middleware
- Password validation

## Tech Stack

### Frontend

- **React 19** - Modern UI framework with hooks
- **React Router v7** - Client-side routing
- **Context API** - Authentication and user state management
- **Axios** - HTTP client for API communication
- **Vite** - Fast build tool and dev server
- **CSS** - Responsive styling

### Backend

- **Node.js** - JavaScript runtime
- **Express** - Web application framework
- **Prisma** - Modern ORM for database operations
- **PostgreSQL** - Relational database
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing
- **express-rate-limit** - Rate limiting middleware
- **CORS** - Cross-origin resource sharing

## Installation & Setup

### Prerequisites

These are the specific versions used during the creation of this project.

- **Node.js** (v22.13.1)
- **PostgreSQL** (v18.0)
- **npm** (v11.4.2)

### Backend Setup

**Important**: Ensure PostgreSQL 18.0 is installed and running on your system before proceeding. See [postgresqlsetup.md](./postgresqlsetup.md) for installation instructions if needed.

1. **Navigate to the backend directory:**

```powershell
cd backend
```

2. **Install dependencies:**

```powershell
npm install
```

3. **Create the database in PostgreSQL:**

Before setting up environment variables, create your database:

```bash
psql -U postgres
```

Then run:

```sql
CREATE DATABASE vacationdb;
\q
```

**Note**: You can use any database name you prefer, just make sure to match it in your `.env` file.

4. **Set up environment variables:**

Create a `.env` file in the `backend` directory with the following content:

```env
NODE_ENV=development
PORT=5000
JWT_SECRET=dev-secret-key-change-in-production-123456789
JWT_EXPIRES_IN=24h
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/vacationdb
CORS_ORIGIN=http://localhost:5173
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

**Important**:

- Replace `YOUR_PASSWORD` with your actual PostgreSQL password
- Replace `vacationdb` if you used a different database name
- `RATE_LIMIT_WINDOW_MS` and `RATE_LIMIT_MAX` are optional and have default values

5. **Generate Prisma client and apply database migrations:**

```powershell
npx prisma generate
npx prisma migrate dev
```

**Note**: The initial migration already exists in the project. The `migrate dev` command will apply it to your database.

### Frontend Setup

1. Navigate to the frontend directory:

```powershell
cd frontend
```

2. Install dependencies:

```powershell
npm install
```

## Running the Application

1. **Start the backend server** (from `backend` directory):

```powershell
npm run dev
```

The backend will run on `http://localhost:5000`

2. **Start the frontend development server** (from `frontend` directory):

```powershell
npm run dev
```

The frontend will run on `http://localhost:5173`

## API Documentation

Base URL: `http://localhost:5000/api`

#### Authentication Endpoints

#### POST `/auth/signup`

Register a new user

- **Body**: `{ email, password, name, role }`
- **Role**: `REQUESTER` or `VALIDATOR`
- **Returns**: `{ success: true, token, user }`

#### POST `/auth/signin`

Sign in with existing credentials

- **Body**: `{ email, password }`
- **Returns**: `{ success: true, token, user }`

#### GET `/auth/me`

Get current user information (currently unused in frontend)

- **Headers**: `Authorization: Bearer <token>`
- **Returns**: `{ success: true, user }`

### Request Endpoints (Requester)

#### POST `/requests`

Submit a new vacation request

- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ startDate, endDate, reason? }`
- **Required Role**: REQUESTER
- **Returns**: `{ success: true, request }`

#### GET `/requests/my-requests`

Get all requests for the current user

- **Headers**: `Authorization: Bearer <token>`
- **Required Role**: REQUESTER
- **Returns**: `{ success: true, requests }`

### Request Endpoints (Validator)

#### GET `/requests/all-requests`

Get all vacation requests

- **Headers**: `Authorization: Bearer <token>`
- **Query Params**: `status` (optional: PENDING, APPROVED, REJECTED)
- **Required Role**: VALIDATOR
- **Returns**: `{ success: true, requests }`

#### PUT `/requests/:id/approve`

Approve a pending request

- **Headers**: `Authorization: Bearer <token>`
- **Required Role**: VALIDATOR
- **Returns**: `{ success: true, request }`

#### PUT `/requests/:id/reject`

Reject a pending request

- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ comments? }`
- **Required Role**: VALIDATOR
- **Returns**: `{ success: true, request }`

## Testing

Run the backend tests:

```powershell
cd backend
npm test
```

The test suite includes:

- Integration tests for requester workflow
- Integration tests for validator workflow
- Authentication flow testing

## Technical Choices

### Why These Technologies?

**JWT (JSON Web Tokens)**: Chosen for simplicity in basic authentication. The token-based system works well for this use case without needing complex session management.

**Prisma ORM**: Works great with PostgreSQL and provides a modern approach to database interactions. The schema-first design makes it easy to manage database structure and migrations.

**Context API**: Used to have the necessary token available throughout the frontend for validating requests to the backend, along with storing user data and roles. This eliminates prop drilling and provides centralized state management.

**Simple Validation**: Instead of using validation libraries like Zod, simple validation was implemented because there isn't much validation logic needed for this project. This keeps dependencies minimal.

**Minimal Dependencies**: Tried to avoid unnecessary libraries to keep the project lean and reduce bloat. Only essential packages were added for core functionality.

**CORS & Basic Security**: Implemented CORS on the backend along with other basic security measures like rate limiting, password hashing, and input sanitization.

**Request Logging**: Logging of requests on the backend for development purposes and manual validation during testing.

**Testing**: Added some tests on the backend to ensure core functionality works correctly.

### Architecture Decisions

- **Separation of Concerns**: Clear separation between routes, controllers, and models
- **Middleware Chain**: Authentication → Authorization → Validation → Controller
- **JWT for Authentication**: Simple token-based authentication for stateless API access
- **Context API**: Used to get the current logged-in user from anywhere in the frontend
- **Error Handling**: Centralized error handling middleware
- **Rate Limiting**: Different limits for different endpoint types
- **Client-side Validation**: Immediate feedback before server round-trip
- **Server-side Validation**: Security layer to prevent invalid data
- **Custom Hooks**: Reusable logic for better code organization and reusability
- **Bonus Feature**: Added the ability to search for users by name with `useDebounce` hook

### Known Limitations

1. **No Request Cancellation**: Requesters cannot cancel their own pending requests
2. **No Audit Trail**: System doesn't track who approved/rejected requests or when
3. **No Date Range Validation**: No restriction on past dates, maximum duration, or overlapping requests
4. **No Pagination**: All requests load at once (could be slow with many requests)
5. **Limited Search**: Can search requests by user name with debounced input, but cannot search by reason or other fields
6. **Limited Sorting**: Requests only sorted by creation date (newest first)
7. **No Statistics Dashboard**: Validators don't see request statistics or analytics
8. **No Bulk Actions**: Cannot approve/reject multiple requests at once
9. **No Export Functionality**: Cannot export request data to CSV/Excel

10. **Token-based, Not State-based**: The backend provides tokens and authentication isn't state-based but token-based. If the token expires, users need to log in again
11. **No Token State Detection**: There's no detection of token loss or the current state of the logged-in user. We only know if a user has the right permissions when they make a request to the backend
12. **Local Storage Only**: JWT stored only in browser localStorage (no refresh tokens)
13. **No Token Expiration Handling**: Frontend doesn't handle expired tokens gracefully - users need to manually log in again

### Security Considerations

- **Password Protection**: Passwords are hashed with bcrypt and never exposed in API responses
- **Selective Data Exposure**: Only safe user fields (id, name, email, role) are returned in API responses
- **Rate Limiting**: Helps prevent brute force attacks
- **Input Validation**: Prevents SQL injection (Prisma handles this automatically)
- **CORS Configuration**: Configured for development (should be restricted in production)
- **JWT Security**: JWT secrets should be strong and rotated regularly

---

**Note**: This application is built for evaluation purposes. Production deployment would require additional security measures, monitoring, logging, and infrastructure considerations.
