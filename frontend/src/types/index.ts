// ============================================================
// CompareIQ Frontend — Shared Types
// Single source of truth for all data shapes used in the UI
// ============================================================

// ---- Enums ----

export type Tier = 'FREE' | 'PRO' | 'TEAM';
export type Winner = 'productA' | 'productB' | 'tie';

// ---- User ----

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

export interface UserStats {
  totalComparisons: number;
  thisMonth: number;
  savedCount: number;
}

// ---- Auth ----

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
}

// ---- Products ----

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

export interface ProductSearchResult
  extends Pick<Product, 'id' | 'name' | 'brand' | 'category' | 'price' | 'imageUrl'> { }

// ---- Comparison ----

export interface CategoryScore {
  name: string;
  productAScore: number;
  productBScore: number;
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
  bestFor: { productA: string; productB: string };
  recommendation: string;
}

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

export interface CreateComparisonInput {
  productAName: string;
  productBName: string;
  preferences?: UserPreferences;
}

// ---- Pagination ----

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ---- API Error ----

export interface ApiError {
  statusCode: number;
  message: string | string[];
  error?: string;
}
