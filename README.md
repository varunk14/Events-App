# Events App

A monorepo for managing events with spike-safe RSVP handling. NestJS API + React frontend, deployed on Render.

## Live demo

| Service | URL |
|---------|-----|
| **Frontend** | https://events-web-pycz.onrender.com |
| **API** | https://events-api-gj0d.onrender.com |
| **Swagger** | https://events-api-gj0d.onrender.com/api |
| **Health** | https://events-api-gj0d.onrender.com/health |

**Demo login:** `demo@rescuerituals.dev` / `demo1234`

> The API runs on Render's free tier and may take 30–60 seconds to wake up after idle time.

## Structure

```text
events-app/
├── events-api/     # NestJS + PostgreSQL + TypeORM
├── events-web/     # React + Vite + TypeScript
├── render.yaml     # Render deployment blueprint
└── .github/workflows/keep-alive.yml
```

## Features

- JWT authentication (register / login)
- Event CRUD with creator-only edit/delete
- RSVP with pessimistic row locking for concurrency-safe capacity handling
- Waitlist with automatic promotion on cancellation

## Local development

### Prerequisites

- Node.js 18+
- Docker (for local Postgres) or local PostgreSQL

### Database

```bash
docker run --name events-pg -e POSTGRES_USER=events \
  -e POSTGRES_PASSWORD=events_pass -e POSTGRES_DB=events_db \
  -p 5432:5432 -d postgres:16
```

### API (`events-api`)

```bash
cd events-api
cp .env.example .env   # set JWT_SECRET
npm install
npm run seed
npm run start:dev
```

- Health: http://localhost:3000/health
- Swagger: http://localhost:3000/api

### Web (`events-web`)

```bash
cd events-web
cp .env.example .env   # VITE_API_URL=http://localhost:3000
npm install
npm run dev
```

- App: http://localhost:5173

## Deployment (Render)

Infra: Render — API on a free Web Service, React on a free Static Site, managed Postgres. HTTPS and subdomains are provided by Render.

1. Push the repo and apply the root `render.yaml` blueprint in the Render dashboard.
2. After the first deploy, set environment variables:
   - **events-api** → `SELF_URL=https://events-api-gj0d.onrender.com/health`
   - **events-web** → `VITE_API_URL=https://events-api-gj0d.onrender.com`
3. Redeploy both services. The API seeds demo data on startup.

A GitHub Actions cron (`.github/workflows/keep-alive.yml`) pings the API every 14 minutes to reduce cold starts on the free tier.

**Note:** The free API tier idles after 15 minutes; it is kept warm via an internal interval ping plus the GitHub Actions cron. Free Postgres expires in 30 days. For production, use a paid always-on instance and database migrations instead of `synchronize`.
