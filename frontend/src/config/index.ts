// ============================================================
// CompareIQ Frontend — Centralized Configuration
// All env vars and app-wide settings live here ONLY
// ============================================================

// ---- API Configuration ----

export const API_CONFIG = {
    /** Base URL for the backend API */
    BASE_URL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001',
    /** Frontend app URL */
    APP_URL: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
    /** Timeout for API requests in ms */
    TIMEOUT_MS: 30_000,
} as const;

// ---- Authentication ----

export const AUTH_CONFIG = {
    /** localStorage key for access token */
    ACCESS_TOKEN_KEY: 'accessToken',
    /** localStorage key for refresh token */
    REFRESH_TOKEN_KEY: 'refreshToken',
    /** Routes that require authentication */
    PROTECTED_ROUTES: ['/dashboard', '/compare', '/history', '/settings'],
    /** Routes only for unauthenticated users */
    AUTH_ROUTES: ['/login', '/register'],
    /** Redirect after login */
    DEFAULT_REDIRECT: '/dashboard',
    /** Login page path */
    LOGIN_PATH: '/login',
} as const;

// ---- App Metadata ----

export const APP_META = {
    NAME: 'CompareIQ',
    TAGLINE: 'AI-powered product comparison',
    DESCRIPTION: 'Compare any two products side-by-side using the power of AI.',
    URL: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
    TWITTER_HANDLE: '@compareiq',
} as const;

// ---- Navigation Routes ----

export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    DASHBOARD: '/dashboard',
    COMPARE: '/compare',
    COMPARE_RESULT: (id: string) => `/compare/${id}`,
    HISTORY: '/history',
    SETTINGS: '/settings',
    PRICING: '/pricing',
    SHARE: (token: string) => `/share/${token}`,
} as const;

// ---- Query Keys (TanStack Query) ----

export const QUERY_KEYS = {
    USER: ['user'] as const,
    USER_STATS: ['user', 'stats'] as const,
    COMPARISONS: (params?: Record<string, unknown>) =>
        params ? (['comparisons', params] as const) : (['comparisons'] as const),
    COMPARISON: (id: string) => ['comparison', id] as const,
    PRODUCTS_SEARCH: (query: string) => ['products', 'search', query] as const,
} as const;

// ---- Pagination ----

export const PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
} as const;

// ---- UI / Theme ----

export const UI_CONFIG = {
    /** Debounce delay for search inputs in ms */
    SEARCH_DEBOUNCE_MS: 300,
    /** Toast notification duration in ms */
    TOAST_DURATION_MS: 4000,
    /** Animation duration for score bars in ms */
    SCORE_BAR_ANIMATION_MS: 800,
} as const;

// ---- Comparison Priorities ----

export const COMPARISON_PRIORITIES = [
    { value: 'performance', label: 'Performance' },
    { value: 'value', label: 'Value for Money' },
    { value: 'design', label: 'Design & Build Quality' },
    { value: 'durability', label: 'Durability' },
    { value: 'features', label: 'Features' },
    { value: 'battery', label: 'Battery Life' },
    { value: 'camera', label: 'Camera Quality' },
    { value: 'display', label: 'Display Quality' },
] as const;

// ---- Pricing Plans ----

export const PRICING_PLANS = [
    {
        id: 'free',
        name: 'Free',
        price: 0,
        period: 'forever',
        description: 'Perfect for personal use',
        features: [
            '5 comparisons per day',
            'Basic AI analysis',
            'Share comparison links',
            'Comparison history (30 days)',
        ],
        cta: 'Get Started Free',
        highlighted: false,
    },
    {
        id: 'pro',
        name: 'Pro',
        price: 9.99,
        period: 'month',
        description: 'For power users and researchers',
        features: [
            'Unlimited comparisons',
            'Advanced AI analysis',
            'Priority processing',
            'Unlimited history',
            'Export to PDF',
            'Custom preferences',
        ],
        cta: 'Start Pro Trial',
        highlighted: true,
    },
    {
        id: 'team',
        name: 'Team',
        price: 29.99,
        period: 'month',
        description: 'For teams and businesses',
        features: [
            'Everything in Pro',
            'Up to 10 team members',
            'Shared comparison library',
            'Admin dashboard',
            'API access',
            'Priority support',
        ],
        cta: 'Start Team Trial',
        highlighted: false,
    },
] as const;
