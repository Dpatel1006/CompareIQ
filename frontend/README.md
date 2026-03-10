# CompareIQ — Frontend (Web)

> Next.js 14 frontend for the CompareIQ AI product comparison platform.

---

## 🧠 What This Is

The frontend is a **Next.js 16** application that:
- Provides a modern, responsive UI for comparing any two products
- Calls the CompareIQ backend API to trigger AI comparisons
- Displays rich visual results: winner banners, score bars, pros/cons, recommendations
- Manages auth state via **Zustand** and **JWT tokens**
- Uses **TanStack Query** for data fetching and caching
- Styled with **Tailwind CSS v4** + **shadcn/ui** + **Framer Motion** animations

---

## 📋 Prerequisites

| Tool | Version |
|---|---|
| Node.js | >= 18 |
| npm | >= 9 |
| CompareIQ Backend | Running on http://localhost:3001 |

> Start the backend first before running the frontend. See `apps/api/README.md`.

---

## ⚙️ Environment Setup

The `.env.local` file is already created at `apps/web/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

No changes needed unless you're running the backend on a different port.

---

## 🚀 Running the Frontend

### Install dependencies
```bash
npm install
```

### Start in development mode
```bash
npm run dev
```

The app will be available at: **http://localhost:3000**

### Build for production
```bash
npm run build
npm run start
```

---

## 📄 Pages

| Page | URL | Description |
|---|---|---|
| Landing | `/` | Marketing + hero page |
| Register | `/register` | Create a new account |
| Login | `/login` | Sign in |
| Dashboard | `/dashboard` | User home, quick compare, recent history |
| Compare | `/compare` | Enter two products and run AI comparison |
| Result | `/compare/[id]` | Full AI comparison result with visualizations |
| History | `/history` | All past comparisons |
| Settings | `/settings` | Profile and preferences |
| Public Share | `/share/[token]` | Shareable public comparison (no auth needed) |
| Pricing | `/pricing` | Pricing tiers |

---

## 🗂️ Project Structure

```
src/
├── app/
│   ├── layout.tsx            # Root layout (fonts, providers)
│   ├── page.tsx              # Landing page
│   ├── (auth)/
│   │   ├── login/            # Login page
│   │   └── register/         # Register page
│   ├── (app)/
│   │   ├── dashboard/        # Dashboard
│   │   ├── compare/          # Compare input + result pages
│   │   ├── history/          # History page
│   │   └── settings/         # Settings page
│   ├── share/[id]/           # Public shareable result
│   └── pricing/              # Pricing page
├── components/
│   ├── ui/                   # shadcn/ui base components
│   ├── layout/               # Navbar, Sidebar, Footer
│   ├── compare/              # CompareForm, ProductSearchInput
│   ├── results/              # WinnerBadge, ScoreBar, ProductCard
│   ├── dashboard/            # StatsCard, RecentComparisons
│   └── auth/                 # LoginForm, RegisterForm
├── lib/
│   ├── api.ts                # Axios API client with auth interceptor
│   ├── auth.ts               # Token helpers
│   └── utils.ts              # cn(), formatters
├── hooks/
│   ├── useComparison.ts      # TanStack Query — run comparison
│   ├── useHistory.ts         # TanStack Query — fetch history
│   └── useAuth.ts            # Auth state
└── store/
    ├── authStore.ts          # Zustand auth store
    └── compareStore.ts       # Zustand comparison state
```

---

## 🔧 Useful Commands

```bash
npm run dev      # Start dev server at localhost:3000
npm run build    # Build production bundle
npm run start    # Start production server
npm run lint     # Lint the code
```
