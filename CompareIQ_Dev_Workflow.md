# CompareIQ — Complete Developer Workflow

> **Last Updated:** 2026-03-09
> This is the single source of truth for the CompareIQ full-stack AI product comparison platform.
> **Tech Stack:** Next.js 16, NestJS 11, PostgreSQL 15, Prisma ORM, Google Gemini AI, Tailwind CSS 4, shadcn/ui, Zustand, TanStack Query.

---

## 🧠 WHAT THIS PROJECT IS

**CompareIQ** — An AI-powered product comparison web app.
A user enters two product names, optionally sets preferences (budget, priorities, use case), and the system calls **Google Gemini AI** to generate a structured, scored, visual comparison with a clear winner and reasoning.

**Core User Flow:**
```
Landing Page → Register/Login → Dashboard → Compare Page → AI Results Page → History
```

**Key Features:**
- ✅ JWT + Google OAuth authentication
- ✅ AI-powered comparison via Gemini 2.0 Flash
- ✅ Category-by-category scored breakdown (0-10)
- ✅ Pros/cons, best-for, full recommendation per product
- ✅ Shareable public comparison links
- ✅ Paginated comparison history
- ✅ User preferences & settings
- ✅ Swagger API documentation
- ✅ Dark mode support
- ✅ Responsive (mobile-first)

---

## 📁 PROJECT STRUCTURE

```
CompareIQ/
├── frontend/                        # Next.js 16 Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx           # Root layout (fonts, providers, dark mode)
│   │   │   ├── page.tsx             # Landing Page (/)
│   │   │   ├── providers.tsx        # TanStack Query + Theme providers
│   │   │   ├── globals.css          # Tailwind CSS v4 global styles
│   │   │   ├── not-found.tsx        # 404 Page
│   │   │   ├── global-error.tsx     # Global error boundary
│   │   │   ├── (auth)/
│   │   │   │   ├── login/
│   │   │   │   │   └── page.tsx     # Login Page (/login)
│   │   │   │   └── register/
│   │   │   │       └── page.tsx     # Register Page (/register)
│   │   │   ├── (app)/
│   │   │   │   ├── layout.tsx       # App shell (navbar, sidebar, auth guard)
│   │   │   │   ├── error.tsx        # In-app error boundary
│   │   │   │   ├── dashboard/
│   │   │   │   │   ├── page.tsx     # Dashboard (/dashboard)
│   │   │   │   │   └── loading.tsx  # Dashboard skeleton
│   │   │   │   ├── compare/
│   │   │   │   │   ├── page.tsx     # Compare Input (/compare)
│   │   │   │   │   ├── loading.tsx  # Compare skeleton
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── page.tsx # Comparison Result (/compare/[id])
│   │   │   │   ├── history/
│   │   │   │   │   ├── page.tsx     # History Page (/history)
│   │   │   │   │   └── loading.tsx  # History skeleton
│   │   │   │   └── settings/
│   │   │   │       ├── page.tsx     # Settings (/settings)
│   │   │   │       └── loading.tsx  # Settings skeleton
│   │   │   ├── share/
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx     # Public Share Page (/share/[id])
│   │   │   └── pricing/
│   │   │       └── page.tsx         # Pricing Page (/pricing)
│   │   ├── components/
│   │   │   ├── ui/                  # shadcn/ui base components
│   │   │   │   ├── badge.tsx
│   │   │   │   ├── button.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── checkbox.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   ├── label.tsx
│   │   │   │   ├── skeleton.tsx
│   │   │   │   └── ...             # + more shadcn components
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   └── Footer.tsx
│   │   │   ├── compare/
│   │   │   │   ├── CompareForm.tsx
│   │   │   │   ├── ProductSearchInput.tsx
│   │   │   │   ├── PreferencesPanel.tsx
│   │   │   │   ├── CompareButton.tsx
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
│   │   ├── config/
│   │   │   └── index.ts             # ★ Centralized config (env, routes, query keys, UI constants, pricing)
│   │   ├── lib/
│   │   │   ├── api.ts               # Axios client + auth interceptor + auto-refresh
│   │   │   ├── auth.ts              # Token storage, decode, expiry check
│   │   │   └── utils.ts             # cn(), formatters
│   │   ├── hooks/
│   │   │   ├── useComparison.ts     # TanStack Query — create & fetch comparison
│   │   │   ├── useHistory.ts        # TanStack Query — paginated history
│   │   │   └── useAuth.ts           # Auth state hook
│   │   ├── store/
│   │   │   ├── authStore.ts         # Zustand — user, login, register, logout
│   │   │   └── compareStore.ts      # Zustand — active comparison state
│   │   ├── types/
│   │   │   └── index.ts             # ★ All TypeScript types (User, Product, Comparison, etc.)
│   │   └── middleware.ts            # Route protection (redirect unauthed users)
│   ├── .env.local                   # Frontend environment variables
│   ├── package.json
│   ├── next.config.ts
│   ├── tsconfig.json
│   ├── postcss.config.mjs
│   └── README.md
│
├── backend/                         # NestJS 11 Backend
│   ├── src/
│   │   ├── main.ts                  # Bootstrap, Swagger, CORS, ValidationPipe
│   │   ├── app.module.ts            # Root module (imports all feature modules)
│   │   ├── app.controller.ts        # Health check controller
│   │   ├── app.service.ts           # App service
│   │   ├── config/                  # ★ Centralized configuration
│   │   │   ├── app.config.ts        # All env vars typed + validated in one function
│   │   │   ├── constants.ts         # All magic strings/numbers (routes, pagination, AI, swagger)
│   │   │   └── types.ts            # Branded primitives, const enums, shared types
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   │   ├── auth.module.ts
│   │   │   │   ├── auth.controller.ts    # register, login, refresh, google, logout
│   │   │   │   ├── auth.service.ts       # bcrypt hash, JWT sign/verify
│   │   │   │   ├── strategies/
│   │   │   │   │   ├── jwt.strategy.ts       # Passport JWT strategy
│   │   │   │   │   └── google.strategy.ts    # Passport Google OAuth2 strategy
│   │   │   │   └── dto/
│   │   │   │       ├── register.dto.ts       # name, email, password validation
│   │   │   │       └── login.dto.ts          # email, password validation
│   │   │   ├── users/
│   │   │   │   ├── users.module.ts
│   │   │   │   ├── users.controller.ts   # me, update, delete, stats
│   │   │   │   ├── users.service.ts      # CRUD operations on User
│   │   │   │   └── dto/
│   │   │   │       └── update-user.dto.ts
│   │   │   ├── comparisons/
│   │   │   │   ├── comparisons.module.ts
│   │   │   │   ├── comparisons.controller.ts  # create, list, get, delete, share
│   │   │   │   ├── comparisons.service.ts     # Orchestrator: Products → AI → DB
│   │   │   │   └── dto/
│   │   │   │       └── create-comparison.dto.ts
│   │   │   ├── products/
│   │   │   │   ├── products.module.ts
│   │   │   │   ├── products.controller.ts  # search, getById
│   │   │   │   ├── products.service.ts     # findOrCreate, search
│   │   │   │   └── dto/
│   │   │   │       └── search-product.dto.ts
│   │   │   └── ai/
│   │   │       ├── ai.module.ts
│   │   │       ├── ai.service.ts          # Google Gemini integration + validation
│   │   │       └── prompts/
│   │   │           └── comparison.prompt.ts  # Structured prompt builder
│   │   ├── common/
│   │   │   ├── guards/
│   │   │   │   └── jwt-auth.guard.ts      # Global JWT auth guard
│   │   │   ├── decorators/
│   │   │   │   ├── current-user.decorator.ts  # @CurrentUser() param decorator
│   │   │   │   └── public.decorator.ts        # @Public() route decorator
│   │   │   ├── filters/
│   │   │   │   └── http-exception.filter.ts   # Global exception formatting
│   │   │   └── interceptors/
│   │   │       └── logging.interceptor.ts     # Request/response logging
│   │   └── prisma/
│   │       ├── prisma.module.ts       # Global Prisma module
│   │       └── prisma.service.ts      # PrismaClient with PrismaPg adapter (reads DATABASE_URL)
│   ├── prisma/
│   │   ├── schema.prisma             # DB schema (User, Product, Comparison, Tier enum)
│   │   └── migrations/               # Migration history
│   │       └── 20260309054630_init/
│   ├── .env                          # Backend environment variables
│   ├── package.json
│   ├── nest-cli.json
│   ├── tsconfig.json
│   ├── tsconfig.build.json
│   ├── eslint.config.mjs
│   └── README.md
│
├── README.md                        # Project overview + quick start
├── package.json                     # Root (monorepo scripts)
├── turbo.json                       # Turborepo task config
├── .gitignore
├── .prettierrc
└── .npmrc
```

---

## 🗄️ DATABASE SCHEMA (Prisma)

**File:** `backend/prisma/schema.prisma`

```prisma
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["driverAdapters"]
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

model User {
  id           String       @id @default(cuid())
  email        String       @unique
  name         String?
  passwordHash String?
  googleId     String?      @unique
  tier         Tier         @default(FREE)
  preferences  Json?        // { budget: string, priorities: string[] }
  comparisons  Comparison[]
  createdAt    DateTime     @default(now())
  updatedAt    DateTime     @updatedAt
}

model Product {
  id           String       @id @default(cuid())
  name         String
  brand        String?
  category     String
  price        Float?
  imageUrl     String?
  specs        Json         // flexible JSONB: { ram: "16GB", storage: "512GB", ... }
  rating       Float?
  reviewCount  Int?
  sourceUrl    String?
  externalId   String?
  comparisonsA Comparison[] @relation("ProductA")
  comparisonsB Comparison[] @relation("ProductB")
  createdAt    DateTime     @default(now())
  updatedAt    DateTime     @updatedAt
}

model Comparison {
  id         String   @id @default(cuid())
  userId     String?
  user       User?    @relation(fields: [userId], references: [id])
  productAId String
  productA   Product  @relation("ProductA", fields: [productAId], references: [id])
  productBId String
  productB   Product  @relation("ProductB", fields: [productBId], references: [id])
  preferences Json?   // user's stated preferences at time of comparison
  result     Json     // full AI output (see AI Output Schema below)
  winnerId   String   // "productA" | "productB" | "tie"
  isPublic   Boolean  @default(false)
  shareToken String?  @unique
  createdAt  DateTime @default(now())
}

enum Tier {
  FREE
  PRO
  TEAM
}
```

---

## 🤖 AI OUTPUT SCHEMA (TypeScript Type)

**File:** `frontend/src/types/index.ts` and `backend/src/config/types.ts`

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

export interface CreateComparisonInput {
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

### Total Pages: 10 (9 main + 1 bonus)

---

### PAGE 1 — Landing Page `/`
**File:** `frontend/src/app/page.tsx`
**Type:** Public (no auth required) | Server Component
**Status:** ✅ Complete

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
- `Footer.tsx`

**Navigation OUT from this page:**
- → `/register` (Get Started CTA)
- → `/login` (Login button)
- → `/pricing` (Pricing link)

---

### PAGE 2 — Register Page `/register`
**File:** `frontend/src/app/(auth)/register/page.tsx`
**Type:** Public (redirect to /dashboard if already logged in) | Client Component
**Status:** ✅ Complete

**Purpose:** New user registration.

**What's on this page:**
1. **RegisterForm** — Name, Email, Password, Confirm Password fields
2. **Google OAuth Button** — "Continue with Google"
3. **Link to /login** — "Already have an account? Sign in"

**Components used:**
- `RegisterForm.tsx` — React Hook Form + Zod validation
  - Fields: `name`, `email`, `password`, `confirmPassword`
  - On submit: POST `/auth/register` → save JWT → redirect to `/dashboard`

**API calls:**
- `POST /auth/register` → `{ name, email, password }` → `{ accessToken, refreshToken, user }`

**Navigation OUT:**
- → `/dashboard` (on success)
- → `/login` (link)

---

### PAGE 3 — Login Page `/login`
**File:** `frontend/src/app/(auth)/login/page.tsx`
**Type:** Public (redirect to /dashboard if already logged in) | Client Component
**Status:** ✅ Complete

**Purpose:** Returning user authentication.

**What's on this page:**
1. **LoginForm** — Email, Password fields
2. **Google OAuth Button**
3. **Link to /register**
4. **Forgot Password link** (Phase 2 feature — show as disabled for MVP)

**Components used:**
- `LoginForm.tsx`
  - On submit: POST `/auth/login` → save JWT in Zustand store + localStorage → redirect to `/dashboard`

**API calls:**
- `POST /auth/login` → `{ email, password }` → `{ accessToken, refreshToken, user }`

**Navigation OUT:**
- → `/dashboard` (on success)
- → `/register` (link)

---

### PAGE 4 — Dashboard `/dashboard`
**File:** `frontend/src/app/(app)/dashboard/page.tsx`
**Type:** Protected (requires auth) | Server Component + Client islands
**Status:** ✅ Complete

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
**File:** `frontend/src/app/(app)/compare/page.tsx`
**Type:** Protected | Client Component
**Status:** ✅ Complete

**Purpose:** The core action page. User enters two products and preferences, then triggers AI comparison.

**What's on this page:**
1. **Page Title** — "Compare Any Two Products"
2. **Product A Search Input** — Autocomplete search field
3. **VS Divider** — Animated "VS" badge between the two inputs
4. **Product B Search Input** — Autocomplete search field
5. **Preferences Panel** (collapsible) — Budget input, Priority checkboxes (Performance, Value, Design, Durability, Features, Battery Life, Camera Quality, Display Quality), Use case textarea
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
- `CompareForm.tsx`

**State flow:**
```
User types in ProductSearchInput
  → debounce 300ms (configurable in frontend/src/config/index.ts → UI_CONFIG.SEARCH_DEBOUNCE_MS)
  → GET /products/search?q=iphone15
  → dropdown shows results
  → user selects → stored in compareStore.productA

User clicks "Analyze with AI"
  → POST /comparisons { productAName, productBName, preferences }
  → on success: router.push(`/compare/${result.id}`)
  → on loading: show skeleton
  → on error: show error toast + retry button
```

**API calls:**
- `GET /products/search?q={query}` → array of product suggestions
- `POST /comparisons` → `CreateComparisonInput` → `{ id, ...ComparisonResult }`

**Navigation OUT:**
- → `/compare/[id]` (on successful comparison)

---

### PAGE 6 — Comparison Result Page `/compare/[id]`
**File:** `frontend/src/app/(app)/compare/[id]/page.tsx`
**Type:** Protected (owner) + Public (if isPublic=true) | Server Component + Client islands
**Status:** ✅ Complete

**Purpose:** Displays the full AI comparison result in a rich visual layout.

**What's on this page:**
1. **Comparison Header** — "ProductA  vs  ProductB" with both product images
2. **Winner Banner** — Large highlighted banner showing winner name + one-line reason
3. **Summary Card** — AI-generated 2-3 sentence plain English verdict
4. **Category Breakdown** — For each category (Performance, Value, Design, etc.):
   - Category name
   - Score bar for Product A (colored, animated fill — duration configurable in `UI_CONFIG.SCORE_BAR_ANIMATION_MS`)
   - Score bar for Product B (colored, animated fill)
   - Winner indicator + 1-line reasoning
5. **Product Cards Side-by-Side** — For each product:
   - Price, Rating, Key Specs list
   - Pros list (green checkmarks)
   - Cons list (red crosses)
6. **Best For Section** — "Product A is best for: [use case]" vs "Product B is best for: [use case]"
7. **Full Recommendation** — Full paragraph AI recommendation
8. **Action Bar** — "Compare Again", "Share this result", "Save to History"
9. **Related Comparisons** — (Phase 2 — placeholder for MVP)

**Components used:**
- `WinnerBadge.tsx`
- `CategoryBreakdown.tsx` (with animated `ScoreBar.tsx`)
- `ProductCard.tsx` × 2
- `ReasoningSection.tsx`
- `ComparisonResult.tsx`
- `ShareButton.tsx` → calls `PATCH /comparisons/:id/share` → generates `shareToken` → copies `/share/[token]` to clipboard

**API calls:**
- `GET /comparisons/:id` → full `Comparison` object with nested `ComparisonResult`

**Navigation OUT:**
- → `/compare` ("Compare Again" button)
- → `/share/[id]` (share link — opens in new tab)
- → `/history` (breadcrumb)

---

### PAGE 7 — History Page `/history`
**File:** `frontend/src/app/(app)/history/page.tsx`
**Type:** Protected | Server Component + Client pagination
**Status:** ✅ Complete

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
**File:** `frontend/src/app/(app)/settings/page.tsx`
**Type:** Protected | Client Component
**Status:** ✅ Complete

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
- `DELETE /users/me` → delete account

---

### PAGE 9 — Public Share Page `/share/[id]`
**File:** `frontend/src/app/share/[id]/page.tsx`
**Type:** Public (no auth required) | Server Component
**Status:** ✅ Complete

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

### PAGE 10 (BONUS) — Pricing Page `/pricing`
**File:** `frontend/src/app/pricing/page.tsx`
**Type:** Public | Server Component
**Status:** ✅ Complete

**Purpose:** Display pricing tiers and encourage upgrade.

**What's on this page:**
1. **3 Pricing Tiers** — configurable via `frontend/src/config/index.ts → PRICING_PLANS`:
   - **Free** ($0/forever) — 5 comparisons/day, basic AI, share links, 30-day history
   - **Pro** ($9.99/month) — Unlimited comparisons, advanced AI, priority processing, unlimited history, PDF export, custom preferences
   - **Team** ($29.99/month) — Everything in Pro + 10 members, shared library, admin dashboard, API access, priority support
2. **FAQ Section**
3. **CTA** → `/register`

> **Note:** Pricing values are centralized in `frontend/src/config/index.ts` under `PRICING_PLANS`. To update pricing, change that single file.

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

Base URL: `http://localhost:3001`
Swagger Docs: `http://localhost:3001/api/docs`

### Auth Endpoints
| Method | Path | Body/Query | Response | Auth |
|--------|------|-----------|----------|------|
| `POST` | `/auth/register` | `{ name, email, password }` | `{ accessToken, refreshToken, user }` | ❌ Public |
| `POST` | `/auth/login` | `{ email, password }` | `{ accessToken, refreshToken, user }` | ❌ Public |
| `POST` | `/auth/refresh` | `{ refreshToken }` | `{ accessToken, refreshToken }` | ❌ Public |
| `GET`  | `/auth/google` | — | Redirects to Google OAuth | ❌ Public |
| `GET`  | `/auth/google/callback` | Google token | `{ accessToken, refreshToken, user }` | ❌ Public |
| `POST` | `/auth/logout` | — | `{ message }` | ✅ JWT |

### Users Endpoints
| Method | Path | Body/Query | Response | Auth |
|--------|------|-----------|----------|------|
| `GET`    | `/users/me` | — | `User` object | ✅ JWT |
| `PATCH`  | `/users/me` | `{ name?, preferences? }` | Updated `User` | ✅ JWT |
| `DELETE` | `/users/me` | — | `{ message }` | ✅ JWT |
| `GET`    | `/users/me/stats` | — | `{ totalComparisons, thisMonth, savedCount }` | ✅ JWT |

### Comparisons Endpoints
| Method | Path | Body/Query | Response | Auth |
|--------|------|-----------|----------|------|
| `POST`   | `/comparisons` | `CreateComparisonInput` | Full `Comparison` with AI result | ✅ JWT |
| `GET`    | `/comparisons` | `?page&limit&search&category` | `PaginatedResponse<ComparisonListItem>` | ✅ JWT |
| `GET`    | `/comparisons/:id` | — | Full `Comparison` object | ✅ JWT (or public if isPublic) |
| `DELETE` | `/comparisons/:id` | — | `{ message }` | ✅ JWT (owner only) |
| `PATCH`  | `/comparisons/:id/share` | — | `{ shareToken }` | ✅ JWT (owner only) |
| `GET`    | `/comparisons/share/:token` | — | Public `Comparison` data | ❌ Public |

### Products Endpoints
| Method | Path | Body/Query | Response | Auth |
|--------|------|-----------|----------|------|
| `GET` | `/products/search` | `?q={query}&category={optional}` | `ProductSearchResult[]` | ✅ JWT |
| `GET` | `/products/:id` | — | Full `Product` object | ✅ JWT |

---

## ⚙️ ENVIRONMENT VARIABLES

### Frontend (`frontend/.env.local`)
```env
# API
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Backend (`backend/.env`)
```env
# Database (Local PostgreSQL)
DATABASE_URL="postgresql://postgres:admin123@localhost:5432/compareiq"
DIRECT_URL="postgresql://postgres:admin123@localhost:5432/compareiq"

# Auth
JWT_SECRET="compareiq-dev-secret-key-2024"
JWT_REFRESH_SECRET="compareiq-dev-refresh-secret-2024"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# Server
PORT=3001
NODE_ENV=development
ALLOWED_ORIGIN="http://localhost:3000"

# Google Gemini AI
GEMINI_API_KEY="YOUR_GEMINI_API_KEY_HERE"
GEMINI_MODEL="gemini-2.0-flash"
GEMINI_MAX_TOKENS=4000
GEMINI_TEMPERATURE=0.7

# Google OAuth (optional)
GOOGLE_CLIENT_ID="YOUR_GOOGLE_CLIENT_ID"
GOOGLE_CLIENT_SECRET="YOUR_GOOGLE_CLIENT_SECRET"
GOOGLE_CALLBACK_URL="http://localhost:3001/auth/google/callback"
```

> **Note:** All backend env vars are accessed exclusively through `backend/src/config/app.config.ts`. Never use `process.env` directly in service code.

---

## 🚀 LOCAL DEVELOPMENT SETUP (No Docker)

### Prerequisites
| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | >= 18 | Runtime |
| npm | >= 9 | Package manager |
| PostgreSQL | >= 15 | Database (running on port 5432, password: `admin123`) |

### Step 1: Install Dependencies
```bash
# From project root — installs both frontend and backend
npm install
```

### Step 2: Database Setup
```bash
cd backend
npm run db:migrate       # Apply all migrations
npm run db:generate      # Generate Prisma client
```

### Step 3: Add Your API Key
Edit `backend/.env` and set `GEMINI_API_KEY` to your real key.
Get a free key at: https://aistudio.google.com/app/apikey

### Step 4: Start Backend
```bash
cd backend
npm run dev
# → API:    http://localhost:3001
# → Docs:   http://localhost:3001/api/docs
```

### Step 5: Start Frontend (new terminal)
```bash
cd frontend
npm run dev
# → App:    http://localhost:3000
```

### Useful Database Commands
```bash
cd backend
npm run db:migrate        # Apply pending migrations
npm run db:migrate:dev    # Create and apply a new migration
npm run db:generate       # Regenerate Prisma client
npm run db:studio         # Open visual DB browser at localhost:5555
npm run db:push           # Push schema changes without migration
npm run db:reset          # Reset the entire database
```

---

## 🏗️ BUILD STATUS — COMPLETION TRACKER

### PHASE A — Project Foundation ✅ COMPLETE
| Step | Task | Status |
|------|------|--------|
| 1 | Create monorepo with Turborepo | ✅ Done |
| 2 | Set up Next.js frontend (`frontend/`) | ✅ Done |
| 3 | Set up NestJS backend (`backend/`) | ✅ Done |
| 4 | Install shared dependencies | ✅ Done |
| 5 | Set up local PostgreSQL (no Docker) | ✅ Done |
| 6 | Initialize Prisma schema and run migrations | ✅ Done |

### PHASE B — Backend Core ✅ COMPLETE
| Step | Task | Status |
|------|------|--------|
| 7 | Create PrismaModule and PrismaService | ✅ Done |
| 8 | Create AuthModule (register, login, JWT strategy, Google OAuth) | ✅ Done |
| 9 | Create UsersModule (CRUD, preferences, stats) | ✅ Done |
| 10 | Create ProductsModule (search, findOrCreate) | ✅ Done |
| 11 | Create AIModule (Gemini integration, prompt builder, response validator) | ✅ Done |
| 12 | Create ComparisonsModule (orchestrator — Products → AI → DB) | ✅ Done |
| 13 | Add centralized config (`src/config/app.config.ts`, `constants.ts`, `types.ts`) | ✅ Done |
| 14 | Add global exception filter and request logging interceptor | ✅ Done |
| 15 | Add Swagger docs at `/api/docs` | ✅ Done |

### PHASE C — Frontend Core ✅ COMPLETE
| Step | Task | Status |
|------|------|--------|
| 16 | Set up Zustand stores (authStore, compareStore) | ✅ Done |
| 17 | Set up TanStack Query provider (`providers.tsx`) | ✅ Done |
| 18 | Set up API client (`lib/api.ts` with axios + auth interceptor + auto-refresh) | ✅ Done |
| 19 | Install and configure shadcn/ui components | ✅ Done |
| 20 | Build Navbar, Sidebar, and Footer | ✅ Done |
| 21 | Build Landing Page (`/`) | ✅ Done |
| 22 | Build Register Page + Login Page + connect to API | ✅ Done |
| 23 | Build App Layout with auth guard + middleware.ts | ✅ Done |
| 24 | Build Compare Input Page (`/compare`) with all components | ✅ Done |
| 25 | Build Comparison Result Page (`/compare/[id]`) with visualizations | ✅ Done |
| 26 | Build Dashboard (`/dashboard`) with stats, recents, quick compare | ✅ Done |
| 27 | Build History Page (`/history`) with table/card views and pagination | ✅ Done |
| 28 | Build Settings Page (`/settings`) | ✅ Done |
| 29 | Build Public Share Page (`/share/[id]`) | ✅ Done |
| 30 | Build Pricing Page (`/pricing`) | ✅ Done |
| 31 | Add centralized config (`src/config/index.ts`) with routes, query keys, UI constants, pricing | ✅ Done |

### PHASE D — Polish & Ship
| Step | Task | Status |
|------|------|--------|
| 32 | Add loading skeletons for all API-dependent pages | ✅ Done (loading.tsx files exist for dashboard, compare, history, settings) |
| 33 | Add error boundaries and friendly error states | ✅ Done (error.tsx, global-error.tsx, not-found.tsx) |
| 34 | Test all flows end-to-end | 🔲 TODO |
| 35 | Set up GitHub Actions CI (lint, test, build) | 🔲 TODO |
| 36 | Deploy backend (Railway/Render) | 🔲 TODO |
| 37 | Deploy frontend (Vercel) | 🔲 TODO |

---

## 🎨 STYLING CONVENTIONS

- **Tailwind CSS v4** for all styling — no inline styles, no CSS modules
- **shadcn/ui** components as the base for all UI elements (button, card, input, badge, skeleton, checkbox, label, etc.)
- **Primary color:** `indigo-600` / **Accent:** `violet-600`
- All pages must be **responsive** (mobile-first)
- **Framer Motion** for:
  - Page transitions
  - Score bar fill animations (duration: `UI_CONFIG.SCORE_BAR_ANIMATION_MS`)
  - Winner banner reveal
  - Hover micro-interactions
- **Dark mode** implemented via `next-themes` from day 1

---

## 🔐 AUTH FLOW IMPLEMENTATION

```
1. User registers or logs in
   → POST /auth/register  or  POST /auth/login

2. Backend validates credentials, returns:
   { accessToken (expires 15min), refreshToken (expires 7 days), user }

3. Frontend stores tokens:
   - accessToken → localStorage (key: 'accessToken')
   - refreshToken → localStorage (key: 'refreshToken')
   - user → Zustand authStore (in-memory)

4. Every API request:
   Axios interceptor reads token from localStorage
   Attaches it as:  Authorization: Bearer <accessToken>

5. On 401 response:
   Axios response interceptor catches it
   → Calls POST /auth/refresh with refreshToken
   → Gets new accessToken
   → Retries the original failed request
   → If refresh also fails → clear tokens → redirect to /login

6. Route protection (server-side):
   middleware.ts checks for 'accessToken' cookie
   → Protected routes (/dashboard, /compare, /history, /settings) redirect to /login
   → Auth routes (/login, /register) redirect to /dashboard if already logged in
```

---

## 🔧 CENTRALIZED CONFIGURATION STRATEGY

All hardcoded values have been moved to centralized config files. This makes future changes trivial.

### Backend Config Files (`backend/src/config/`)

| File | Purpose | Examples |
|------|---------|---------|
| `app.config.ts` | All env vars typed and validated | `db.url`, `jwt.secret`, `ai.geminiApiKey`, `ai.model` |
| `constants.ts` | All magic strings/numbers | Route names, pagination defaults, AI score range, Swagger title |
| `types.ts` | Branded primitives, shared types | `UserId`, `ProductId`, `Winner`, `ComparisonResult` |

### Frontend Config File (`frontend/src/config/index.ts`)

| Export | Purpose | Examples |
|--------|---------|---------|
| `API_CONFIG` | Backend URL, timeout | `BASE_URL`, `TIMEOUT_MS` |
| `AUTH_CONFIG` | Token keys, protected routes | `ACCESS_TOKEN_KEY`, `PROTECTED_ROUTES` |
| `APP_META` | App name, tagline, SEO | `NAME`, `DESCRIPTION`, `URL` |
| `ROUTES` | All route paths | `DASHBOARD`, `COMPARE`, `COMPARE_RESULT(id)` |
| `QUERY_KEYS` | TanStack Query cache keys | `USER`, `COMPARISON(id)`, `PRODUCTS_SEARCH(q)` |
| `PAGINATION` | Page defaults | `DEFAULT_PAGE`, `DEFAULT_LIMIT` |
| `UI_CONFIG` | UI timing/behavior | `SEARCH_DEBOUNCE_MS`, `SCORE_BAR_ANIMATION_MS` |
| `COMPARISON_PRIORITIES` | Priority options for preferences | `performance`, `value`, `battery`, etc. |
| `PRICING_PLANS` | All pricing tier data | Name, price, period, features, CTA text |

> **Rule:** Never hardcode strings, URLs, timing values, or business data directly in components. Always import from config.

---

## 📝 QUICK REFERENCE COMMANDS

### From Project Root
```bash
npm run dev               # Run both frontend + backend via Turbo
npm run dev:backend       # Run backend only
npm run dev:frontend      # Run frontend only
npm run build             # Build all
npm run lint              # Lint all
npm run format            # Format all files with Prettier
```

### Backend (`cd backend`)
```bash
npm run dev               # Start with hot reload (watch mode)
npm run build             # Compile TypeScript
npm run start:prod        # Run compiled production build
npm run lint              # Lint backend code
npm run test              # Run unit tests
npm run test:e2e          # Run end-to-end tests
npm run db:migrate        # Apply pending migrations
npm run db:migrate:dev    # Create + apply new migration
npm run db:generate       # Regenerate Prisma client
npm run db:studio         # Open Prisma Studio UI (localhost:5555)
npm run db:push           # Push schema without migration file
npm run db:reset          # Reset entire database
```

### Frontend (`cd frontend`)
```bash
npm run dev               # Start dev server at localhost:3000
npm run build             # Build production bundle
npm run start             # Start production server
npm run lint              # Lint frontend code
```

### Kill Port 3001 (if needed)
```powershell
Get-NetTCPConnection -LocalPort 3001 | Select-Object -ExpandProperty OwningProcess | ForEach-Object { Stop-Process -Id $_ -Force }
```

---

## 🔭 PHASE 2 ROADMAP (Future Enhancements)

These are features planned for after MVP launch:

| Feature | Priority | Notes |
|---------|----------|-------|
| Forgot Password / Password Reset | High | Email verification flow |
| Related Comparisons | High | Show 3 similar comparisons on result page |
| Redis Caching | Medium | Cache comparison results by hash key to reduce AI calls |
| Export to PDF | Medium | One-click PDF download of comparison result |
| Product Image Scraping | Medium | Auto-fetch product images from web |
| Rate Limiting | Medium | Tier-based limits (Free: 5/day, Pro: unlimited) |
| Stripe Payment Integration | Medium | Connect to /pricing page |
| Email Notifications | Low | Weekly comparison digest email |
| Multi-product Comparison | Low | Compare 3+ products at once |
| Comparison Templates | Low | Pre-built templates for common comparisons |
| Admin Dashboard | Low | View all users, comparisons, analytics |
| i18n / Internationalization | Low | Multi-language support |

---

*This workflow is the single source of truth for building CompareIQ. All phases A–C are complete. Phase D (Polish & Ship) has testing and deployment remaining.*
