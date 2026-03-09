# CompareIQ — Complete Developer Workflow for VS Code Copilot
> Copy this entire file and paste it into your VS Code Copilot Agent chat to begin building.
> This is a full-stack AI product comparison platform using Next.js 14, NestJS, PostgreSQL, Redis, and OpenAI.

---

## 🧠 WHAT YOU ARE BUILDING

**CompareIQ** — An AI-powered product comparison web app.
A user enters two product names, optionally sets preferences (budget, priorities), and the system fetches product data, calls OpenAI GPT-4o, and returns a structured, visual comparison with a clear winner and reasoning.

**Core User Flow:**
```
Landing Page → Register/Login → Compare Page → Results Page → History Page
```

---

## 📁 COMPLETE PROJECT STRUCTURE

```
compareiq/
├── apps/
│   ├── web/                          # Next.js 14 Frontend
│   │   ├── app/
│   │   │   ├── layout.tsx            # Root layout (fonts, providers)
│   │   │   ├── page.tsx              # Landing Page (/)
│   │   │   ├── (auth)/
│   │   │   │   ├── login/
│   │   │   │   │   └── page.tsx      # Login Page (/login)
│   │   │   │   └── register/
│   │   │   │       └── page.tsx      # Register Page (/register)
│   │   │   ├── (app)/
│   │   │   │   ├── layout.tsx        # App shell (navbar, sidebar, auth guard)
│   │   │   │   ├── dashboard/
│   │   │   │   │   └── page.tsx      # Dashboard (/dashboard)
│   │   │   │   ├── compare/
│   │   │   │   │   ├── page.tsx      # Compare Input Page (/compare)
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── page.tsx  # Comparison Result (/compare/[id])
│   │   │   │   ├── history/
│   │   │   │   │   └── page.tsx      # History Page (/history)
│   │   │   │   └── settings/
│   │   │   │       └── page.tsx      # Profile & Settings (/settings)
│   │   │   ├── share/
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx      # Public Share Page (/share/[id])
│   │   │   ├── pricing/
│   │   │   │   └── page.tsx          # Pricing Page (/pricing)
│   │   │   └── not-found.tsx         # 404 Page
│   │   ├── components/
│   │   │   ├── ui/                   # shadcn/ui base components
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   └── Footer.tsx
│   │   │   ├── compare/
│   │   │   │   ├── CompareForm.tsx
│   │   │   │   ├── ProductSearchInput.tsx
│   │   │   │   ├── PreferencesPanel.tsx
│   │   │   │   └── CompareButton.tsx
│   │   │   ├── results/
│   │   │   │   ├── ComparisonResult.tsx
│   │   │   │   ├── WinnerBadge.tsx
│   │   │   │   ├── ScoreBar.tsx
│   │   │   │   ├── CategoryBreakdown.tsx
│   │   │   │   ├── ProductCard.tsx
│   │   │   │   ├── ReasoningSection.tsx
│   │   │   │   └── ShareButton.tsx
│   │   │   ├── dashboard/
│   │   │   │   ├── RecentComparisons.tsx
│   │   │   │   ├── StatsCard.tsx
│   │   │   │   └── QuickCompareWidget.tsx
│   │   │   ├── history/
│   │   │   │   ├── HistoryTable.tsx
│   │   │   │   └── HistoryCard.tsx
│   │   │   └── auth/
│   │   │       ├── LoginForm.tsx
│   │   │       └── RegisterForm.tsx
│   │   ├── lib/
│   │   │   ├── api.ts                # Axios/fetch API client
│   │   │   ├── auth.ts               # Auth helpers (token storage, decode)
│   │   │   └── utils.ts              # cn(), formatters
│   │   ├── hooks/
│   │   │   ├── useComparison.ts      # TanStack Query - run comparison
│   │   │   ├── useHistory.ts         # TanStack Query - fetch history
│   │   │   └── useAuth.ts            # Auth state hook
│   │   ├── store/
│   │   │   ├── authStore.ts          # Zustand - user, token
│   │   │   └── compareStore.ts       # Zustand - active comparison state
│   │   └── types/
│   │       └── index.ts              # Shared TS types (re-exported from packages)
│   │
│   └── api/                          # NestJS Backend
│       ├── src/
│       │   ├── main.ts               # Bootstrap, Swagger, CORS
│       │   ├── app.module.ts         # Root module
│       │   ├── modules/
│       │   │   ├── auth/
│       │   │   │   ├── auth.module.ts
│       │   │   │   ├── auth.controller.ts
│       │   │   │   ├── auth.service.ts
│       │   │   │   ├── strategies/
│       │   │   │   │   ├── jwt.strategy.ts
│       │   │   │   │   └── google.strategy.ts
│       │   │   │   └── dto/
│       │   │   │       ├── register.dto.ts
│       │   │   │       └── login.dto.ts
│       │   │   ├── users/
│       │   │   │   ├── users.module.ts
│       │   │   │   ├── users.controller.ts
│       │   │   │   ├── users.service.ts
│       │   │   │   └── dto/
│       │   │   │       └── update-user.dto.ts
│       │   │   ├── comparisons/
│       │   │   │   ├── comparisons.module.ts
│       │   │   │   ├── comparisons.controller.ts
│       │   │   │   ├── comparisons.service.ts
│       │   │   │   └── dto/
│       │   │   │       └── create-comparison.dto.ts
│       │   │   ├── products/
│       │   │   │   ├── products.module.ts
│       │   │   │   ├── products.controller.ts
│       │   │   │   ├── products.service.ts
│       │   │   │   └── dto/
│       │   │   │       └── search-product.dto.ts
│       │   │   └── ai/
│       │   │       ├── ai.module.ts
│       │   │       ├── ai.service.ts
│       │   │       └── prompts/
│       │   │           └── comparison.prompt.ts
│       │   ├── common/
│       │   │   ├── guards/
│       │   │   │   └── jwt-auth.guard.ts
│       │   │   ├── decorators/
│       │   │   │   └── current-user.decorator.ts
│       │   │   ├── filters/
│       │   │   │   └── http-exception.filter.ts
│       │   │   └── interceptors/
│       │   │       └── logging.interceptor.ts
│       │   └── prisma/
│       │       ├── prisma.module.ts
│       │       └── prisma.service.ts
│       └── prisma/
│           ├── schema.prisma
│           └── migrations/
│
├── packages/
│   ├── types/
│   │   └── src/
│   │       └── index.ts              # Shared types used by both apps
│   └── config/
│       ├── eslint-config/
│       └── tsconfig/
│
├── docker-compose.yml                # PostgreSQL + Redis locally
├── turbo.json
└── package.json
```

---

## 🗄️ DATABASE SCHEMA (Prisma)

**File: `apps/api/prisma/schema.prisma`**

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String       @id @default(cuid())
  email         String       @unique
  name          String?
  passwordHash  String?
  googleId      String?      @unique
  tier          Tier         @default(FREE)
  preferences   Json?        // { budget: string, priorities: string[] }
  comparisons   Comparison[]
  createdAt     DateTime     @default(now())
  updatedAt     DateTime     @updatedAt
}

model Product {
  id            String       @id @default(cuid())
  name          String
  brand         String?
  category      String
  price         Float?
  imageUrl      String?
  specs         Json         // flexible JSONB: { ram: "16GB", storage: "512GB", ... }
  rating        Float?
  reviewCount   Int?
  sourceUrl     String?
  externalId    String?
  comparisonsA  Comparison[] @relation("ProductA")
  comparisonsB  Comparison[] @relation("ProductB")
  createdAt     DateTime     @default(now())
  updatedAt     DateTime     @updatedAt
}

model Comparison {
  id            String       @id @default(cuid())
  userId        String?
  user          User?        @relation(fields: [userId], references: [id])
  productAId    String
  productA      Product      @relation("ProductA", fields: [productAId], references: [id])
  productBId    String
  productB      Product      @relation("ProductB", fields: [productBId], references: [id])
  preferences   Json?        // user's stated preferences at time of comparison
  result        Json         // full AI output (see AI Output Schema below)
  winnerId      String       // "productA" | "productB" | "tie"
  isPublic      Boolean      @default(false)
  shareToken    String?      @unique
  createdAt     DateTime     @default(now())
}

enum Tier {
  FREE
  PRO
  TEAM
}
```

---

## 🤖 AI OUTPUT SCHEMA (TypeScript Type)

**File: `packages/types/src/index.ts`**

```typescript
export interface ComparisonResult {
  winner: 'productA' | 'productB' | 'tie';
  winnerName: string;
  summary: string;                    // 2-3 sentence plain English verdict
  categories: CategoryScore[];
  productA: ProductAnalysis;
  productB: ProductAnalysis;
  bestFor: {
    productA: string;                 // "Best for users who need X"
    productB: string;                 // "Best for users who need Y"
  };
  recommendation: string;             // 1 paragraph full recommendation
}

export interface CategoryScore {
  name: string;                       // e.g. "Performance", "Value for Money"
  productAScore: number;              // 0-10
  productBScore: number;              // 0-10
  winner: 'productA' | 'productB' | 'tie';
  reasoning: string;
}

export interface ProductAnalysis {
  name: string;
  price: number | null;
  pros: string[];
  cons: string[];
  rating: number | null;
  keySpecs: Record<string, string>;
}

export interface CreateComparisonDto {
  productAName: string;
  productBName: string;
  preferences?: {
    budget?: string;                  // e.g. "under $500"
    priorities?: string[];            // e.g. ["battery life", "camera quality"]
    useCase?: string;                 // e.g. "for college student"
  };
}
```

---

## 🌐 ALL PAGES — DETAILED BREAKDOWN

### Total Pages: 9

---

### PAGE 1 — Landing Page `/`
**File:** `apps/web/app/page.tsx`
**Type:** Public (no auth required) | Server Component

**Purpose:** Marketing page. Converts visitors into signups.

**Sections on this page:**
1. **Hero Section** — Headline, subheadline, animated demo of a comparison, CTA buttons ("Start Comparing Free", "See How It Works")
2. **How It Works** — 3-step visual: Enter Products → AI Analyzes → Get Results
3. **Category Showcase** — Icons showing Electronics, Clothing, Home Appliances, Sports Gear
4. **Sample Comparison** — Static preview of what a comparison result looks like
5. **Pricing Teaser** — Free vs Pro, link to /pricing
6. **Footer** — Links to /pricing, /login, /register

**Components used:**
- `Navbar.tsx` (with Login / Get Started buttons)
- `HeroSection.tsx`
- `HowItWorks.tsx`
- `CategoryShowcase.tsx`
- `SampleComparison.tsx` (static mock data)
- `PricingTeaser.tsx`
- `Footer.tsx`

**Navigation OUT from this page:**
- → `/register` (Get Started CTA)
- → `/login` (Login button)
- → `/pricing` (Pricing link)

---

### PAGE 2 — Register Page `/register`
**File:** `apps/web/app/(auth)/register/page.tsx`
**Type:** Public (redirect to /dashboard if already logged in) | Client Component

**Purpose:** New user registration.

**What's on this page:**
1. **RegisterForm** — Name, Email, Password, Confirm Password fields
2. **Google OAuth Button** — "Continue with Google"
3. **Link to /login** — "Already have an account? Sign in"

**Components used:**
- `RegisterForm.tsx` — React Hook Form + Zod validation
  - Fields: `name`, `email`, `password`, `confirmPassword`
  - On submit: POST `/api/auth/register` → save JWT → redirect to `/dashboard`
- `GoogleOAuthButton.tsx`

**API calls:**
- `POST /auth/register` → `{ name, email, password }` → `{ accessToken, refreshToken, user }`

**Navigation OUT:**
- → `/dashboard` (on success)
- → `/login` (link)

---

### PAGE 3 — Login Page `/login`
**File:** `apps/web/app/(auth)/login/page.tsx`
**Type:** Public (redirect to /dashboard if already logged in) | Client Component

**Purpose:** Returning user authentication.

**What's on this page:**
1. **LoginForm** — Email, Password fields
2. **Google OAuth Button**
3. **Link to /register**
4. **Forgot Password link** (Phase 2 feature — show as disabled for MVP)

**Components used:**
- `LoginForm.tsx`
  - On submit: POST `/api/auth/login` → save JWT in Zustand store + httpOnly cookie → redirect to `/dashboard`

**API calls:**
- `POST /auth/login` → `{ email, password }` → `{ accessToken, refreshToken, user }`

**Navigation OUT:**
- → `/dashboard` (on success)
- → `/register` (link)

---

### PAGE 4 — Dashboard `/dashboard`
**File:** `apps/web/app/(app)/dashboard/page.tsx`
**Type:** Protected (requires auth) | Server Component + Client islands

**Purpose:** User's home base. Quick access to compare and see recent activity.

**What's on this page:**
1. **Welcome Banner** — "Hello [Name], ready to compare something?"
2. **Quick Compare Widget** — Two search inputs + Compare button (same as /compare page but compact)
3. **Stats Row** — Total comparisons made, This month, Saved comparisons
4. **Recent Comparisons** — Last 5 comparisons shown as cards (product names, winner badge, date)
5. **Category Shortcuts** — Buttons: "Compare Laptops", "Compare Phones", "Compare TVs"

**Components used:**
- `QuickCompareWidget.tsx` → on submit, navigates to `/compare` with query params pre-filled
- `StatsCard.tsx` × 3
- `RecentComparisons.tsx` → each card links to `/compare/[id]`

**API calls:**
- `GET /users/me/stats` → `{ totalComparisons, thisMonth, savedCount }`
- `GET /comparisons?limit=5` → array of recent comparisons

**Navigation OUT:**
- → `/compare` (Quick Compare Widget submit)
- → `/compare/[id]` (Recent comparison cards)
- → `/history` ("View All" button)

---

### PAGE 5 — Compare Input Page `/compare`
**File:** `apps/web/app/(app)/compare/page.tsx`
**Type:** Protected | Client Component

**Purpose:** The core action page. User enters two products and preferences, then triggers AI comparison.

**What's on this page:**
1. **Page Title** — "Compare Any Two Products"
2. **Product A Search Input** — Autocomplete search field
3. **VS Divider** — Animated "VS" badge between the two inputs
4. **Product B Search Input** — Autocomplete search field
5. **Preferences Panel** (collapsible) — Budget input, Priority checkboxes (Performance, Value, Design, Durability, Features), Use case textarea
6. **Compare Button** — "Analyze with AI" — triggers API call
7. **Loading State** — Skeleton/spinner with "AI is analyzing..." message while waiting
8. **Error State** — If API fails, show friendly error with retry button

**Components used:**
- `ProductSearchInput.tsx`
  - Calls `GET /products/search?q={query}` on each keystroke (debounced 300ms)
  - Shows dropdown with product suggestions
  - Stores selected product in `compareStore` (Zustand)
- `PreferencesPanel.tsx`
- `CompareButton.tsx`

**State flow:**
```
User types in ProductSearchInput
  → debounce 300ms
  → GET /products/search?q=iphone15
  → dropdown shows results
  → user selects → stored in compareStore.productA

User clicks "Analyze with AI"
  → POST /comparisons { productAName, productBName, preferences }
  → on success: router.push(`/compare/${result.id}`)
  → on loading: show skeleton
```

**API calls:**
- `GET /products/search?q={query}` → array of product suggestions
- `POST /comparisons` → `CreateComparisonDto` → `{ id, ...ComparisonResult }`

**Navigation OUT:**
- → `/compare/[id]` (on successful comparison)

---

### PAGE 6 — Comparison Result Page `/compare/[id]`
**File:** `apps/web/app/(app)/compare/[id]/page.tsx`
**Type:** Protected (owner) + Public (if isPublic=true) | Server Component + Client islands

**Purpose:** Displays the full AI comparison result in a rich visual layout.

**What's on this page:**
1. **Comparison Header** — "ProductA  vs  ProductB" with both product images
2. **Winner Banner** — Large highlighted banner showing winner name + one-line reason
3. **Summary Card** — AI-generated 2-3 sentence plain English verdict
4. **Category Breakdown** — For each category (Performance, Value, Design, etc.):
   - Category name
   - Score bar for Product A (colored, animated fill)
   - Score bar for Product B (colored, animated fill)
   - Winner indicator + 1-line reasoning
5. **Product Cards Side-by-Side** — For each product:
   - Price, Rating, Key Specs list
   - Pros list (green checkmarks)
   - Cons list (red crosses)
6. **Best For Section** — "Product A is best for: [use case]" vs "Product B is best for: [use case]"
7. **Full Recommendation** — Full paragraph AI recommendation
8. **Action Bar** — "Compare Again", "Share this result", "Save to History"
9. **Related Comparisons** — 3 suggestions of similar comparisons (Phase 2 — show as empty for MVP)

**Components used:**
- `WinnerBadge.tsx`
- `CategoryBreakdown.tsx` (with animated `ScoreBar.tsx`)
- `ProductCard.tsx` × 2
- `ReasoningSection.tsx`
- `ShareButton.tsx` → calls `PATCH /comparisons/:id/share` → generates `shareToken` → copies `/share/[token]` to clipboard

**API calls:**
- `GET /comparisons/:id` → full `Comparison` object with nested `ComparisonResult`

**Navigation OUT:**
- → `/compare` ("Compare Again" button)
- → `/share/[id]` (share link — opens in new tab)
- → `/history` (breadcrumb)

---

### PAGE 7 — History Page `/history`
**File:** `apps/web/app/(app)/history/page.tsx`
**Type:** Protected | Server Component + Client pagination

**Purpose:** All past comparisons in one place.

**What's on this page:**
1. **Page Header** — "Your Comparison History" + total count
2. **Filter Bar** — Search by product name, Filter by category, Sort by date/newest/oldest
3. **History Table / Grid** — Each row/card shows:
   - Product A name vs Product B name
   - Winner (badge)
   - Category
   - Date
   - Quick action: "View", "Share", "Delete"
4. **Pagination** — Previous / Next, page numbers
5. **Empty State** — If no history: illustration + "Start your first comparison" CTA

**Components used:**
- `HistoryCard.tsx` — card view (default on mobile)
- `HistoryTable.tsx` — table view (default on desktop)
- TanStack Query for paginated fetching

**API calls:**
- `GET /comparisons?page=1&limit=20&search=&category=` → paginated list

**Navigation OUT:**
- → `/compare/[id]` (View button on each row)
- → `/compare` (Empty state CTA)

---

### PAGE 8 — Settings Page `/settings`
**File:** `apps/web/app/(app)/settings/page.tsx`
**Type:** Protected | Client Component

**Purpose:** User profile and preferences management.

**What's on this page:**
1. **Profile Section** — Name (editable), Email (readonly), Avatar placeholder
2. **Default Preferences** — Pre-fill compare preferences:
   - Default budget range
   - Default priority checkboxes
3. **Account Section** — Change password form, Connected accounts (Google)
4. **Subscription Section** — Current plan badge, upgrade CTA (links to /pricing)
5. **Danger Zone** — Delete account button (confirmation modal)

**API calls:**
- `GET /users/me` → current user profile
- `PATCH /users/me` → `{ name, preferences }` → updated user

---

### PAGE 9 — Public Share Page `/share/[id]`
**File:** `apps/web/app/share/[id]/page.tsx`
**Type:** Public (no auth required) | Server Component

**Purpose:** Shareable read-only view of a comparison. Can be sent to anyone.

**What's on this page:**
- Identical layout to `/compare/[id]` but:
  - No "Save to History" action
  - No "Delete" action
  - Banner at top: "View this on CompareIQ — compare any products for free" → CTA to `/register`
  - If the comparison `isPublic=false` → show 404

**API calls:**
- `GET /comparisons/share/:shareToken` → public comparison data (no auth header)

---

### BONUS — Pricing Page `/pricing`
**File:** `apps/web/app/pricing/page.tsx`
**Type:** Public | Server Component

**What's on this page:**
1. **3 Pricing Tiers** — Free, Pro ($9.99/mo), Team ($29.99/mo) with feature lists
2. **FAQ Section**
3. **CTA** → `/register`

---

## 🔗 PAGE CONNECTION MAP

```
/ (Landing)
├── /register
│   └── /dashboard ✓
├── /login
│   └── /dashboard ✓
└── /pricing

/dashboard (hub)
├── /compare           ← primary action
├── /compare/[id]      ← recent results
└── /history           ← view all

/compare
└── /compare/[id]      ← after AI runs

/compare/[id]
├── /compare           ← compare again
├── /share/[id]        ← share link (new tab)
└── /history           ← breadcrumb

/history
└── /compare/[id]      ← view any past result

/settings
└── /pricing           ← upgrade link

/share/[id]            ← public, no auth
└── /register          ← conversion CTA
```

---

## 🔌 COMPLETE API ENDPOINT REFERENCE

### Auth Endpoints
```
POST   /auth/register          Body: { name, email, password }
POST   /auth/login             Body: { email, password }
POST   /auth/refresh           Body: { refreshToken }
POST   /auth/google            (OAuth callback)
POST   /auth/logout            (clears refresh token cookie)
```

### Users Endpoints
```
GET    /users/me               Returns current user profile
PATCH  /users/me               Body: { name?, preferences? }
DELETE /users/me               Deletes account (with confirmation)
GET    /users/me/stats         Returns { totalComparisons, thisMonth, savedCount }
```

### Comparisons Endpoints
```
POST   /comparisons            Body: CreateComparisonDto → triggers AI, returns full result
GET    /comparisons            Query: ?page&limit&search&category → paginated list
GET    /comparisons/:id        Returns single comparison (auth required if private)
DELETE /comparisons/:id        Deletes a comparison
PATCH  /comparisons/:id/share  Makes comparison public, returns shareToken
GET    /comparisons/share/:token  Public endpoint — no auth needed
```

### Products Endpoints
```
GET    /products/search        Query: ?q={query}&category={optional} → suggestions list
GET    /products/:id           Returns single product details
```

---

## ⚙️ ENVIRONMENT VARIABLES

### Frontend (`apps/web/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Backend (`apps/api/.env`)
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/compareiq
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_REFRESH_SECRET=your-refresh-secret-change-this
OPENAI_API_KEY=sk-...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
SERPER_API_KEY=...
PORT=3001
```

---

## 🐳 DOCKER COMPOSE (Local Development)

**File: `docker-compose.yml`**
```yaml
version: '3.8'
services:
  postgres:
    image: pgvector/pgvector:pg16
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: compareiq
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

---

## 🏗️ BUILD ORDER — FOLLOW THIS SEQUENCE

Build in this exact order. Each step builds on the previous.

### PHASE A — Project Foundation
```
Step 1. Create monorepo with Turborepo
        npx create-turbo@latest compareiq

Step 2. Set up Next.js 14 app (apps/web)
        npx create-next-app@latest apps/web --typescript --tailwind --app

Step 3. Set up NestJS app (apps/api)
        npx @nestjs/cli new apps/api

Step 4. Install shared dependencies
        - Frontend: zustand, @tanstack/react-query, react-hook-form, zod, axios, framer-motion
        - Backend: @nestjs/jwt, @nestjs/passport, passport-jwt, passport-google-oauth20,
                   @prisma/client, prisma, ioredis, openai, bcrypt

Step 5. Start Docker: docker-compose up -d

Step 6. Initialize Prisma schema and run migrations
        npx prisma migrate dev --name init
```

### PHASE B — Backend Core
```
Step 7.  Create PrismaModule and PrismaService
Step 8.  Create AuthModule (register, login, JWT strategy)
Step 9.  Create UsersModule (CRUD, preferences)
Step 10. Create ProductsModule (search with Serper API integration)
Step 11. Create AIModule (OpenAI service, prompt builder, response parser)
Step 12. Create ComparisonsModule (orchestrator — calls Products + AI + cache)
Step 13. Add Redis caching (cache comparison results by hash key)
Step 14. Add global exception filter and request logging interceptor
Step 15. Add Swagger docs (http://localhost:3001/api/docs)
```

### PHASE C — Frontend Core
```
Step 16. Set up Zustand stores (authStore, compareStore)
Step 17. Set up TanStack Query provider in app/layout.tsx
Step 18. Set up API client (lib/api.ts with axios + auth interceptor)
Step 19. Install and configure shadcn/ui components
Step 20. Build Navbar and Footer (layout components)
Step 21. Build Landing Page (/) — static, no API calls
Step 22. Build Register Page + LoginPage + connect to API
Step 23. Build App Layout with auth guard
Step 24. Build Compare Input Page (/compare)
Step 25. Build Comparison Result Page (/compare/[id])
Step 26. Build Dashboard (/dashboard)
Step 27. Build History Page (/history)
Step 28. Build Settings Page (/settings)
Step 29. Build Public Share Page (/share/[id])
Step 30. Build Pricing Page (/pricing)
```

### PHASE D — Polish & Ship
```
Step 31. Add loading skeletons for all API-dependent pages
Step 32. Add error boundaries and friendly error states
Step 33. Test all flows end-to-end
Step 34. Set up GitHub Actions CI (lint, test, build)
Step 35. Deploy backend to Railway or Render (free tier to start)
Step 36. Deploy frontend to Vercel
```

---

## 🎨 STYLING CONVENTIONS

- Use **Tailwind CSS** for all styling — no inline styles, no CSS modules
- Use **shadcn/ui** components as the base for all UI elements
- Primary color: `indigo-600` / accent: `violet-600`
- All pages must be **responsive** (mobile-first)
- Use **Framer Motion** for: page transitions, score bar animations, winner banner reveal
- Dark mode: implement from day 1 using `next-themes`

---

## 🔐 AUTH FLOW IMPLEMENTATION

```
1. User logs in → POST /auth/login
2. Backend returns { accessToken (15min), refreshToken (7 days) }
3. Frontend:
   - Stores accessToken in Zustand (memory only)
   - Stores refreshToken in httpOnly cookie (via Set-Cookie header)
4. Every API request: attach accessToken in Authorization: Bearer header
5. On 401 response: auto-call POST /auth/refresh → get new accessToken → retry original request
6. Route protection: middleware.ts in Next.js checks for valid token, redirects to /login if missing
```

---

## 📝 COPILOT INSTRUCTIONS

When using VS Code Copilot Agent with this file:

1. **Start each session** by saying: "I am building CompareIQ. Here is my full project blueprint: [paste this file]"
2. **Per task, say**: "Build Step 7: Create PrismaModule and PrismaService exactly as described in the blueprint"
3. **For pages, say**: "Build the Compare Input Page (/compare) with all components listed in the blueprint"
4. **For the AI engine, say**: "Build the AI comparison engine. It must call OpenAI GPT-4o with JSON mode and return a ComparisonResult object matching the TypeScript type defined in the blueprint"
5. **Always verify** the file path matches the project structure above before accepting Copilot suggestions

---

*This workflow is the single source of truth for building CompareIQ. Follow the Build Order in sequence. Every page, component, API endpoint, and data type is defined above.*
