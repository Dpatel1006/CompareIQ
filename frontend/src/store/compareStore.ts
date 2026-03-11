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
  products: (ProductSelection | null)[];
  preferences: Preferences;
  isComparing: boolean;

  setProduct: (index: number, product: ProductSelection | null) => void;
  addProduct: () => void;
  removeProduct: (index: number) => void;
  setPreferences: (preferences: Preferences) => void;
  setIsComparing: (isComparing: boolean) => void;
  reset: () => void;
}

export const useCompareStore = create<CompareState>((set, get) => ({
  products: [null, null], // Initialize with 2 slots
  preferences: {},
  isComparing: false,

  setProduct: (index, product) => {
    const products = [...get().products];
    products[index] = product;
    set({ products });
  },

  addProduct: () => {
    const products = [...get().products];
    if (products.length < 4) {
      products.push(null);
      set({ products });
    }
  },

  removeProduct: (index) => {
    const products = [...get().products];
    if (products.length > 2) {
      products.splice(index, 1);
      set({ products });
    }
  },

  setPreferences: (preferences) => set({ preferences }),
  setIsComparing: (isComparing) => set({ isComparing }),

  reset: () =>
    set({
      products: [null, null],
      preferences: {},
      isComparing: false,
    }),
}));
