# ProposalFlow

ProposalFlow is a proposal management SaaS demo built with Next.js, TypeScript, Tailwind, Prisma, and SQLite. It is designed to showcase a clean internal workspace for teams that manage clients, proposals, admin oversight, public share links, and PDF exports.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Prisma ORM
- SQLite
- React 19
- `pdf-lib` for PDF generation

## Features

- Email/password authentication with sessions
- User dashboard with proposal and activity overview
- Clients CRUD foundation with relationship-based deal tracking
- Proposal CRUD with status pipeline
- Client details pages with related active, upcoming, and closed deals
- Public proposal share links
- Public accept/reject response flow
- PDF export for proposals
- Admin dashboard, users, activity, and proposal oversight
- Service-layer Prisma access

## Screenshots

Add screenshots here before sharing publicly:

- `docs/screenshots/login.png`
- `docs/screenshots/dashboard.png`
- `docs/screenshots/client-details.png`
- `docs/screenshots/admin.png`

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Create a `.env` file in the project root:

```env
DATABASE_URL="file:./prisma/dev.db"
SESSION_COOKIE_NAME="proposalflow_session"
DEMO_PASSWORD="DemoPass123!"
```

### 3. Generate Prisma client

```bash
npm run prisma:generate
```

### 4. Apply database migrations

```bash
npm run prisma:migrate
```

### 5. Seed demo data

```bash
npm run prisma:seed
```

### 6. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

- `DATABASE_URL`: SQLite database path used by Prisma
- `SESSION_COOKIE_NAME`: optional session cookie override
- `DEMO_PASSWORD`: shared password used for the seeded demo accounts

## Demo Credentials

These credentials are also surfaced on the login page:

- Admin: `admin@proposalflow.demo` / `DemoPass123!`
- Demo user: `maya@proposalflow.demo` / `DemoPass123!`
- Demo user: `ethan@proposalflow.demo` / `DemoPass123!`

## Main Flows

### Auth

Users can register, sign in, and persist authenticated sessions. The login page also includes seeded demo credentials for quick walkthroughs.

### Proposals

Authenticated users can create, edit, update status, view, and export proposals. Proposal records are connected to clients and feed the dashboard, activity log, and client details page.

### Public Share

Each proposal has a public share link. Public viewers can open the proposal, trigger view tracking, and respond by accepting or rejecting it without accessing the internal dashboard.

### Admin

Admin users can review platform-wide users, proposals, activity, and top-line stats from the admin area without breaking user-scoped dashboard isolation.

## Demo Seed Notes

The seed creates:

- 1 admin user
- 2 demo users
- multiple clients for each demo user
- multiple proposals across `DRAFT`, `SENT`, `VIEWED`, `ACCEPTED`, and `REJECTED`

This keeps the dashboard, client pages, proposals list, and admin area populated for demos immediately after seeding.
