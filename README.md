# CompareIQ

> **AI-powered product comparison platform.** Enter any two products — Gemini AI analyzes them and returns a detailed, visual comparison with a clear winner and reasoning.

---

## 🗂️ Project Structure

```
CompareIQ/
├── frontend/               ← Next.js 16 (React UI)
│   ├── src/
│   │   ├── app/            # Pages (Next.js App Router)
│   │   ├── components/     # UI components (shadcn/ui + custom)
│   │   ├── config/         # ★ Centralized config & constants
│   │   ├── hooks/          # TanStack Query hooks
│   │   ├── lib/            # API client, auth helpers, utils
│   │   ├── store/          # Zustand state (auth, compare)
│   │   └── types/          # ★ All TypeScript types
│   ├── .env.local          # Frontend environment variables
│   ├── package.json
│   └── README.md           # Frontend-specific docs
│
├── backend/                ← NestJS (REST API)
│   ├── src/
│   │   ├── config/         # ★ App config, constants, types
│   │   ├── modules/        # Feature modules
│   │   │   ├── auth/       # JWT + Google OAuth
│   │   │   ├── users/      # User profile & stats
│   │   │   ├── comparisons/# Core: AI comparison orchestrator
│   │   │   ├── products/   # Product search & storage
│   │   │   └── ai/         # Google Gemini integration
│   │   ├── common/         # Guards, filters, interceptors
│   │   ├── prisma/         # DB service
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── prisma/
│   │   ├── schema.prisma   # Database schema
│   │   └── migrations/     # Migration history
│   ├── .env                # Backend environment variables
│   ├── package.json
│   └── README.md           # Backend-specific docs
│
├── package.json            # Root (monorepo scripts)
└── turbo.json              # Turborepo config
```

> **★ Key principle**: All magic values (URLs, keys, labels, routes, constants) live in `config/`. Never hardcode them elsewhere.

---

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18
- PostgreSQL >= 15 running on port 5432 with password `admin123`

### 1. Install all dependencies
```bash
npm install
```

### 2. Set up the database
```bash
cd backend
npm run db:migrate       # Apply all migrations
npm run db:generate      # Generate Prisma client
```

### 3. Add your Gemini API key
Edit `backend/.env`:
```env
GEMINI_API_KEY=your_key_here
```
Get a free key at: https://aistudio.google.com/app/apikey

### 4. Run Backend
```bash
cd backend
npm run dev
# → API:    http://localhost:3001
# → Docs:   http://localhost:3001/api/docs
```

### 5. Run Frontend (new terminal)
```bash
cd frontend
npm run dev
# → App: http://localhost:3000
```

---

## 🏃 Run Commands Reference

### From the root (both at once)
```bash
npm run dev               # Run both frontend + backend
npm run dev:backend       # Run backend only
npm run dev:frontend      # Run frontend only
```

### Backend only (`cd backend`)
```bash
npm run dev               # Start with hot reload
npm run start:prod        # Run production build
npm run db:migrate        # Apply DB migrations
npm run db:studio         # Open Prisma DB browser
npm run db:generate       # Regenerate Prisma client
```

### Frontend only (`cd frontend`)
```bash
npm run dev               # Start dev server at :3000
npm run build             # Build production bundle
npm run start             # Start production server
```

---

## 🏗️ Architecture

```
User → Frontend (Next.js :3000)
         ↓ HTTP REST
       Backend (NestJS :3001)
         ↓                 ↓
   PostgreSQL DB     Google Gemini AI
```

### Core Flow
1. User enters **two product names** + optional preferences
2. Frontend POSTs to `POST /comparisons`
3. Backend calls **Gemini AI** with a structured prompt
4. AI returns a scored breakdown (Performance, Value, Design, etc.)
5. Result is saved to **PostgreSQL** and returned to the frontend
6. Frontend renders animated score bars, winner banner, pros/cons

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)
| Variable | Description | Default |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | required |
| `JWT_SECRET` | JWT signing secret | required |
| `GEMINI_API_KEY` | Google Gemini AI key | required |
| `PORT` | API server port | `3001` |
| `ALLOWED_ORIGIN` | CORS allowed origin | `http://localhost:3000` |
| `GEMINI_MODEL` | Gemini model to use | `gemini-2.0-flash` |

### Frontend (`frontend/.env.local`)
| Variable | Description | Default |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:3001` |
| `NEXT_PUBLIC_APP_URL` | Frontend app URL | `http://localhost:3000` |

---

## 📌 Key Design Decisions

| Decision | Rationale |
|---|---|
| All config in `config/` files | Change once, works everywhere. No hunting for magic strings. |
| Separate `frontend/` and `backend/` folders | Each is independently runnable. No cross-folder imports. |
| Types defined per-app | Avoids cross-app coupling. Frontend types mirror backend shapes. |
| Prisma ORM | Type-safe DB queries, auto-generated client, easy migrations. |
| TanStack Query | Automatic caching, loading states, and background refetching. |
| Zustand | Lightweight auth state — no boilerplate like Redux. |
