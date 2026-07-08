# GateWatch Vaniyambadi

Real-time railway gate status monitoring for Vaniyambadi. Know the gate status before reaching it.

## Project Structure

```
gatewatch/
├── backend/          # Express.js + TypeScript API
├── frontend/         # Next.js 15 App Router + TypeScript
└── shared/           # Shared TypeScript types
```

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` with your MongoDB URI and JWT secret:

```env
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/gatewatch
JWT_SECRET=your-random-secret-key-here
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

Seed the admin user and start:

```bash
npm run seed
npm run dev
```

API runs on `http://localhost:5000`.

### 2. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_NAME=GateWatch Vaniyambadi
```

Start:

```bash
npm run dev
```

Frontend runs on `http://localhost:3000`.

### 3. Default Admin Login

- **Username:** admin
- **Password:** admin123

## API Documentation

### Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/login` | No | Login with username/password |
| GET | `/api/auth/me` | Yes | Get current admin profile |

**Login Request:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Login Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "admin": { "id": "...", "username": "admin", "role": "admin" }
  }
}
```

### Gate Status

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/status` | No | Get current gate status |
| GET | `/api/status/updates?limit=20` | No | Get recent gate events |
| POST | `/api/status` | Yes | Update gate status |

**POST /api/status (Close Gate):**
```json
{
  "status": "CLOSED",
  "waitTime": 15,
  "trainName": "Chennai Express",
  "trainNumber": "12345",
  "direction": "up",
  "notes": "Goods train approaching"
}
```

**POST /api/status (Open Gate):**
```json
{
  "status": "OPEN"
}
```

### Trains (Admin only)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/trains` | List all trains |
| POST | `/api/trains` | Create a train |
| PUT | `/api/trains/:id` | Update a train |
| DELETE | `/api/trains/:id` | Delete a train |

### Routes (Admin only)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/routes` | List all routes |
| POST | `/api/routes` | Create a route |
| PUT | `/api/routes/:id` | Update a route |
| DELETE | `/api/routes/:id` | Delete a route |

### Feedback

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/feedback` | Yes | List all feedback |
| POST | `/api/feedback` | No | Submit feedback |
| PUT | `/api/feedback/:id/resolve` | Yes | Mark feedback as resolved |
| DELETE | `/api/feedback/:id` | Yes | Delete feedback |

### Statistics

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/stats/public` | No | Public statistics |
| GET | `/api/stats/admin` | Yes | Admin statistics |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | API health check |

## Database Schema

### Collections

**admins** - Admin user accounts
```
{
  username: string (unique),
  passwordHash: string,
  role: "admin" | "superadmin",
  createdAt: Date
}
```

**gate_status** - Current gate status (single latest record)
```
{
  status: "OPEN" | "CLOSED",
  waitTime: number,
  trainName?: string,
  trainNumber?: string,
  direction?: string,
  notes?: string,
  updatedAt: Date
}
```

**gate_events** - Historical gate events
```
{
  status: "OPEN" | "CLOSED",
  waitTime: number,
  trainName?: string,
  trainNumber?: string,
  direction?: string,
  notes?: string,
  timestamp: Date (indexed)
}
```

**trains** - Train registry
```
{
  trainName: string,
  trainNumber: string (unique),
  route: string,
  direction: string,
  createdAt: Date
}
```

**routes** - Alternative routes
```
{
  routeName: string (unique),
  distance: string,
  status: "active" | "inactive",
  createdAt: Date
}
```

**feedback** - User feedback
```
{
  name: string,
  email: string,
  message: string,
  resolved: boolean,
  createdAt: Date (indexed)
}
```

## Deployment

### Backend → Render

1. Push the `backend/` folder to a GitHub repository (or use root repo with render.yaml).

2. Create a new **Web Service** on Render:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Root Directory: (select backend)

3. Add Environment Variables:
   - `MONGODB_URI` - Your MongoDB Atlas connection string
   - `JWT_SECRET` - Strong random secret
   - `JWT_EXPIRES_IN` - `7d`
   - `NODE_ENV` - `production`
   - `CORS_ORIGIN` - Your frontend URL (e.g., `https://gatewatch.vercel.app`)

4. Run the seed script once:
   ```bash
   npm run seed
   ```
   (Or create admin manually in MongoDB Atlas)

### Frontend → Vercel

1. Push the `frontend/` folder to a GitHub repository.

2. Import project in Vercel:
   - Framework: **Next.js**
   - Root Directory: `frontend`

3. Add Environment Variables:
   - `NEXT_PUBLIC_API_URL` - Your Render backend URL + `/api`
   - `NEXT_PUBLIC_APP_NAME` - `GateWatch Vaniyambadi`

4. Deploy. Vercel auto-detects Next.js settings.

### Render `render.yaml` (for backend root directory)

```yaml
services:
  - type: web
    name: gatewatch-api
    env: node
    buildCommand: npm install && npm run build
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: MONGODB_URI
        sync: false
      - key: JWT_SECRET
        sync: false
      - key: JWT_EXPIRES_IN
        value: 7d
```

## Features

### Public User
- ✅ Real-time gate status (Open/Closed)
- ✅ Estimated waiting time
- ✅ Train information display
- ✅ Recent gate events timeline
- ✅ Alternative routes suggestion
- ✅ Search gate events by date
- ✅ Statistics & analytics
- ✅ Contact & feedback form
- ✅ Dark/Light mode toggle
- ✅ Mobile-responsive design

### Admin Panel
- ✅ JWT authentication
- ✅ Dashboard with statistics
- ✅ Gate control (Open/Close)
- ✅ Train management (CRUD)
- ✅ Route management (CRUD)
- ✅ Feedback management
- ✅ Update history with search
- ✅ Confirmation dialogs
- ✅ Toast notifications

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, TypeScript, Tailwind CSS, Shadcn UI |
| Backend | Node.js, Express.js, TypeScript |
| Database | MongoDB Atlas (Mongoose ODM) |
| Auth | JWT + bcrypt |
| Security | Helmet, CORS, Rate Limiting |
| Charts | Recharts |
| Icons | Lucide React |
| Theme | next-themes |
| Dates | date-fns |
