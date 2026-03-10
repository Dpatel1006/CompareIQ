// ============================================================
// CompareIQ Backend — Shared Types
// Single source of truth for all data shapes
// ============================================================

// ---- Branded Primitives ----

export type UserId = string & { readonly __brand: 'UserId' };
export type ProductId = string & { readonly __brand: 'ProductId' };
export type ComparisonId = string & { readonly __brand: 'ComparisonId' };
export type ShareToken = string & { readonly __brand: 'ShareToken' };

// ---- Enums ----

export const Tier = {
  FREE: 'FREE',
  PRO: 'PRO',
  TEAM: 'TEAM',
} as const;
export type Tier = (typeof Tier)[keyof typeof Tier];

export const Winner = {
  PRODUCT_A: 'productA',
  PRODUCT_B: 'productB',
  TIE: 'tie',
} as const;
export type Winner = (typeof Winner)[keyof typeof Winner];

// ---- Comparison Result Types ----

export interface CategoryScore {
  name: string;
  productAScore: number; // 0-10
  productBScore: number; // 0-10
  winner: Winner;
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

export interface ComparisonResult {
  winner: Winner;
  winnerName: string;
  summary: string;
  categories: CategoryScore[];
  productA: ProductAnalysis;
  productB: ProductAnalysis;
  bestFor: {
    productA: string;
    productB: string;
  };
  recommendation: string;
}

// ---- User Types ----

export interface UserPreferences {
  budget?: string;
  priorities?: string[];
  useCase?: string;
}

export interface User {
  id: string;
  email: string;
  name: string | null;
  tier: Tier;
  preferences: UserPreferences | null;
  createdAt: string;
  updatedAt: string;
}

// ---- Product Types ----

export interface Product {
  id: string;
  name: string;
  brand: string | null;
  category: string;
  price: number | null;
  imageUrl: string | null;
  specs: Record<string, string>;
  rating: number | null;
  reviewCount: number | null;
  sourceUrl: string | null;
}

export interface ProductSearchResult extends Pick<
  Product,
  'id' | 'name' | 'brand' | 'category' | 'price' | 'imageUrl'
> {}

// ---- Comparison API Types ----

export interface Comparison {
  id: string;
  userId: string | null;
  productA: Product;
  productB: Product;
  preferences: UserPreferences | null;
  result: ComparisonResult;
  winnerId: string;
  isPublic: boolean;
  shareToken: string | null;
  createdAt: string;
}

export interface ComparisonListItem {
  id: string;
  productAName: string;
  productBName: string;
  productAImage: string | null;
  productBImage: string | null;
  winner: string;
  category: string;
  createdAt: string;
}

// ---- Auth Types ----

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse extends AuthTokens {
  user: User;
}

// ---- Stats Types ----

export interface UserStats {
  totalComparisons: number;
  thisMonth: number;
  savedCount: number;
}

// ---- Pagination Types ----

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ---- API Error Type ----

export interface ApiError {
  statusCode: number;
  message: string | string[];
  error?: string;
}
