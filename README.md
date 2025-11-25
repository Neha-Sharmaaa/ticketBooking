# CultureTix - Event Ticketing System

A full-featured ticketing application for cultural events, festivals, and workshops with real-time seat booking, admin controls, and live updates.

## Features

- **User Authentication** - Email/password with JWT
- **Event Management** - Multiple sessions per event
- **Seat Selection** - Interactive seat map with VIP/General sections
- **Real-time Updates** - Live seat availability via WebSocket
- **Booking Flow** - Hold seats → Confirm booking
- **Admin Dashboard** - Create events, manage sessions, view analytics
- **Role-based Access** - User vs Admin permissions

## Tech Stack

- **Backend**: Node.js, Express, Prisma, MySQL, Socket.IO
- **Frontend**: React, React Query, React Router, Socket.IO Client

## Quick Start

### Prerequisites

- Node.js 18+
- MySQL database

### 1. Setup Database

Create a MySQL database and update the connection string.

### 2. Setup Server

```bash
cd server
npm install
cp .env.example .env  # Edit with your DATABASE_URL and JWT_SECRET
npx prisma migrate dev --name init
npm run db:seed
npm run dev
```

### 3. Setup Client

```bash
cd client
npm install
npm run dev
```

### 4. Access the App

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

### Test Accounts

- **Admin**: admin@example.com / admin123
- **User**: user@example.com / user123

## API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Events
- `GET /api/events` - List all events
- `GET /api/events/:id` - Event details with sessions

### Sessions
- `GET /api/sessions/:id` - Session details
- `GET /api/sessions/:id/seats` - Seat map with availability

### Bookings
- `POST /api/bookings/hold` - Hold seats (5 min)
- `POST /api/bookings/:id/confirm` - Confirm booking
- `POST /api/bookings/:id/cancel` - Cancel booking
- `GET /api/bookings/my` - User's bookings

### Admin
- `POST /api/admin/events` - Create event
- `PUT /api/admin/events/:id` - Update event
- `DELETE /api/admin/events/:id` - Delete event
- `POST /api/admin/sessions` - Create session with seats
- `GET /api/admin/bookings` - All bookings
- `GET /api/admin/analytics` - Dashboard analytics

## Project Structure

```
/server
  /prisma
    schema.prisma    # Database schema
    seed.js          # Sample data
  /src
    index.js         # Express + Socket.IO server
    /routes          # API routes
    /middlewares     # Auth middleware
    /utils           # Prisma client

/client
  /src
    App.jsx          # Main app with routing
    /pages           # Page components
    /components      # Reusable components
    /hooks           # Custom hooks (auth, socket)
    /services        # API client
```

## Booking Flow

1. User selects seats on the seat map
2. Click "Hold Seats" → Creates PENDING bookings (5 min hold)
3. Timer countdown shows remaining hold time
4. Click "Confirm & Pay" → Updates to CONFIRMED status
5. Real-time updates broadcast to all users viewing the session

## License

MIT

