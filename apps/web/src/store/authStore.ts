'use client';

import { create } from 'zustand';
import api from '@/lib/api';
import { setTokens, clearTokens, getAccessToken, decodeToken } from '@/lib/auth';

interface User {
  id: string;
  email: string;
  name: string | null;
  tier: string;
  preferences: any;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  login: async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password });
    setTokens(data.accessToken, data.refreshToken);
    set({ user: data.user, isAuthenticated: true, isLoading: false });
  },

  register: async (name: string, email: string, password: string) => {
    const { data } = await api.post('/auth/register', { name, email, password });
    setTokens(data.accessToken, data.refreshToken);
    set({ user: data.user, isAuthenticated: true, isLoading: false });
  },

  logout: () => {
    clearTokens();
    set({ user: null, isAuthenticated: false, isLoading: false });
    api.post('/auth/logout').catch(() => {});
  },

  loadUser: async () => {
    try {
      const token = getAccessToken();
      if (!token) {
        set({ user: null, isAuthenticated: false, isLoading: false });
        return;
      }

      const decoded = decodeToken(token);
      if (!decoded || decoded.exp && (decoded as any).exp * 1000 < Date.now()) {
        clearTokens();
        set({ user: null, isAuthenticated: false, isLoading: false });
        return;
      }

      const { data } = await api.get('/users/me');
      set({ user: data, isAuthenticated: true, isLoading: false });
    } catch {
      clearTokens();
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  setUser: (user: User) => {
    set({ user, isAuthenticated: true });
  },
}));
