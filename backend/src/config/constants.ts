// ============================================================
// CompareIQ — Application Constants
// All magic values live here so changes propagate everywhere
// ============================================================

export const AUTH_CONSTANTS = {
  /** JWT bearer token scheme prefix */
  BEARER_PREFIX: 'Bearer ',
  /** Cookie name for access token */
  ACCESS_TOKEN_COOKIE: 'accessToken',
  /** Cookie name for refresh token */
  REFRESH_TOKEN_COOKIE: 'refreshToken',
  /** localStorage key (mirrored from frontend) */
  ACCESS_TOKEN_KEY: 'accessToken',
  REFRESH_TOKEN_KEY: 'refreshToken',
} as const;

export const ROUTES = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    GOOGLE: '/auth/google',
    GOOGLE_CALLBACK: '/auth/google/callback',
  },
  USERS: {
    ME: '/users/me',
    STATS: '/users/me/stats',
  },
  COMPARISONS: {
    BASE: '/comparisons',
    BY_ID: (id: string) => `/comparisons/${id}`,
    SHARE: (id: string) => `/comparisons/${id}/share`,
    PUBLIC: (token: string) => `/comparisons/share/${token}`,
  },
  PRODUCTS: {
    SEARCH: '/products/search',
    BY_ID: (id: string) => `/products/${id}`,
  },
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

export const AI_CONSTANTS = {
  WINNER_OPTIONS: ['productA', 'productB', 'tie'] as const,
  MIN_SCORE: 0,
  MAX_SCORE: 10,
  SYSTEM_PROMPT:
    'You are a product comparison expert. Always respond with valid JSON only. No markdown formatting.',
} as const;

export const DB_CONSTANTS = {
  SHARE_TOKEN_BYTES: 16,
  MAX_POOL_SIZE: 10,
} as const;

export const SWAGGER = {
  TITLE: 'CompareIQ API',
  DESCRIPTION: 'AI-powered product comparison API',
  VERSION: '1.0',
  PATH: 'api/docs',
} as const;

export const TIER_LIMITS = {
  FREE: {
    DAILY_LIMIT: 5,
    HISTORY_DAYS: 30,
    FEATURES: ['basic_ai', 'share_links'],
  },
  PRO: {
    DAILY_LIMIT: 100, // Effectively unlimited
    HISTORY_DAYS: 365,
    FEATURES: ['pro_ai', 'share_links', 'pdf_export', 'no_ads'],
  },
  TEAM: {
    DAILY_LIMIT: 500,
    HISTORY_DAYS: 999,
    FEATURES: ['pro_ai', 'share_links', 'pdf_export', 'no_ads', 'admin_dash'],
  },
} as const;
