'use client';

import { create } from 'zustand';

interface ProductSelection {
  id?: string;
  name: string;
  brand?: string;
  category?: string;
  price?: number;
  imageUrl?: string;
}

interface Preferences {
  budget?: string;
  priorities?: string[];
  useCase?: string;
}

interface CompareState {
  productA: ProductSelection | null;
  productB: ProductSelection | null;
  preferences: Preferences;
  isComparing: boolean;

  setProductA: (product: ProductSelection | null) => void;
  setProductB: (product: ProductSelection | null) => void;
  setPreferences: (preferences: Preferences) => void;
  setIsComparing: (isComparing: boolean) => void;
  reset: () => void;
  swapProducts: () => void;
}

export const useCompareStore = create<CompareState>((set, get) => ({
  productA: null,
  productB: null,
  preferences: {},
  isComparing: false,

  setProductA: (product) => set({ productA: product }),
  setProductB: (product) => set({ productB: product }),
  setPreferences: (preferences) => set({ preferences }),
  setIsComparing: (isComparing) => set({ isComparing }),

  reset: () =>
    set({
      productA: null,
      productB: null,
      preferences: {},
      isComparing: false,
    }),

  swapProducts: () => {
    const { productA, productB } = get();
    set({ productA: productB, productB: productA });
  },
}));
