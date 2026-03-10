# CompareIQ — Backend API

> NestJS REST API powering the CompareIQ AI product comparison platform.

---

## 🧠 What This Is

The backend is a **NestJS** application that:
- Authenticates users (JWT + Google OAuth)
- Accepts two product names and user preferences
- Calls **Google Gemini AI** to generate a structured product comparison
- Stores results in a local **PostgreSQL** database via **Prisma ORM**
- Exposes a fully documented REST API via **Swagger**

---

## 📋 Prerequisites

Before running, make sure you have:

| Tool | Version |
|---|---|
| Node.js | >= 18 |
| npm | >= 9 |
| PostgreSQL | >= 15 (running locally on port 5432) |

> **Redis is optional** — the application will work without it.

---

## ⚙️ Environment Setup

The `.env` file is already created. Open it and fill in your API keys:

```
apps/api/.env
```

The most important values to update:
```env
GEMINI_API_KEY=your_real_gemini_key_here
```

Get a free Gemini API key at: https://aistudio.google.com/app/apikey

---

## 🗄️ Database Setup

### Step 1: Create the database

Open psql or pgAdmin and run:
```sql
CREATE DATABASE compareiq;
```

### Step 2: Run migrations
```bash
npx prisma migrate deploy
```

### Step 3: Generate Prisma client
```bash
npx prisma generate
```

---

## 🚀 Running the Backend

### Install dependencies
```bash
npm install
```

### Start in development mode (with hot reload)
```bash
npm run dev
```

### Start in production mode
```bash
npm run build
npm run start:prod
```

---

## 🌐 API Endpoints

Once running, the API is available at:

| Resource | URL |
|---|---|
| Base API | http://localhost:3001 |
| Swagger Docs | http://localhost:3001/api/docs |

### Key Endpoints
```
POST   /auth/register         Register a new user
POST   /auth/login            Login and get JWT token
GET    /users/me              Get current user profile
POST   /comparisons           Run an AI comparison (main feature)
GET    /comparisons           List user's comparison history
GET    /comparisons/:id       Get a single comparison
GET    /products/search?q=    Search/autocomplete products
```

---

## 🗂️ Project Structure

```
src/
├── main.ts                   # Bootstrap, Swagger, CORS config
├── app.module.ts             # Root NestJS module
├── prisma/
│   ├── prisma.module.ts      # Prisma module
│   └── prisma.service.ts     # DB connection service
├── modules/
│   ├── auth/                 # Register, Login, JWT Strategy
│   ├── users/                # User profile & preferences
│   ├── comparisons/          # Core feature: AI comparison orchestrator
│   ├── products/             # Product search & storage
│   └── ai/                   # Google Gemini integration
└── common/
    ├── guards/               # JWT Auth guard
    ├── filters/              # HTTP exception filter
    └── interceptors/         # Request logging
```

---

## 🔧 Useful Commands

```bash
npm run dev              # Start with hot reload
npm run build            # Compile TypeScript
npm run start:prod       # Run compiled production build
npm run lint             # Lint the code
npx prisma studio        # Open visual DB browser at localhost:5555
npx prisma migrate dev   # Create and apply a new migration
npx prisma db push       # Push schema changes without migration
```
