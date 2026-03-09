// ============================================================
// CompareIQ — Shared Types
// Used by both apps/web (Next.js) and apps/api (NestJS)
// ============================================================

// ---- Comparison Result Types ----

export interface ComparisonResult {
  winner: 'productA' | 'productB' | 'tie';
  winnerName: string;
  summary: string; // 2-3 sentence plain English verdict
  categories: CategoryScore[];
  productA: ProductAnalysis;
  productB: ProductAnalysis;
  bestFor: {
    productA: string; // "Best for users who need X"
    productB: string; // "Best for users who need Y"
  };
  recommendation: string; // 1 paragraph full recommendation
}

export interface CategoryScore {
  name: string; // e.g. "Performance", "Value for Money"
  productAScore: number; // 0-10
  productBScore: number; // 0-10
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

// ---- DTO Types ----

export interface CreateComparisonDto {
  productAName: string;
  productBName: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  budget?: string; // e.g. "under $500"
  priorities?: string[]; // e.g. ["battery life", "camera quality"]
  useCase?: string; // e.g. "for college student"
}

// ---- User Types ----

export type Tier = 'FREE' | 'PRO' | 'TEAM';

export interface User {
  id: string;
  email: string;
  name: string | null;
  tier: Tier;
  preferences: UserPreferences | null;
  createdAt: string;
  updatedAt: string;
}

// ---- Auth Types ----

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
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

export interface ProductSearchResult {
  id: string;
  name: string;
  brand: string | null;
  category: string;
  price: number | null;
  imageUrl: string | null;
}

// ---- Comparison Types ----

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
  winner: string;
  category: string;
  createdAt: string;
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
  message: string;
  error?: string;
}
