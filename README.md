# MeetSpace MVP

MeetSpace is a map-first social event platform where users can discover local events, join/request access, and confirm attendance by scanning host QR codes. Paid events use a Lightning Network invoice simulation flow for MVP testing.

## Stack

- Next.js 14 (App Router) + TypeScript + TailwindCSS
- Prisma ORM + PostgreSQL
- JWT auth (email/password)
- Mapbox GL for map rendering
- html5-qrcode for camera-based QR scanning
- Mock Lightning service (LN invoice simulation + webhook confirmation)

## Features Delivered

- Interactive map homepage with search and filters
- Event creation (public/private/paid + sats pricing)
- Join public events and request access for private events
- Host approval endpoint for private requests
- Host QR generation endpoint with rolling short-lived payloads
- QR scan verification endpoint with attendee validation + rate limiting
- Lightning payment invoice generation and webhook simulation
- Profile dashboard with created/joined/attended/payment sections

## API Overview

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/events`
- `POST /api/events`
- `GET /api/events/:id`
- `POST /api/events/:id/join`
- `POST /api/events/:id/request`
- `POST /api/events/:id/approve`
- `GET /api/events/:id/qr`
- `POST /api/events/:id/scan`
- `POST /api/payments/invoice`
- `POST /api/payments/webhook`
- `GET /api/profile`

## Local Setup

1. Install deps:
   ```bash
   npm install
   ```
2. Configure environment:
   ```bash
   cp .env.example .env
   ```
3. Start PostgreSQL and update `DATABASE_URL`.
4. Generate Prisma client and migrate:
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```
5. Run app:
   ```bash
   npm run dev
   ```

## Security Notes

- JWT is required for protected endpoints.
- Attendance is server-verified; users must be joined before scan acceptance.
- Attendance de-duplicates on `(eventId, userId)`.
- Scan endpoint includes in-memory rate limiting.
- Input validation uses Zod.

## Production Hardening Recommendations

- Replace mock Lightning service with LNbits/OpenNode/Voltage integration.
- Use Redis for distributed rate limiting.
- Add secure refresh-token cookie strategy.
- Add CSRF protection + centralized audit logging.
- Add websocket channel for host approval notifications.
