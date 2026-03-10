'use client';

import { useAuthStore } from '@/store/authStore';

/**
 * Simple hook that exposes auth state and actions.
 * User loading is handled by AppLayout on mount.
 */
export function useAuth() {
  const { user, isLoading, isAuthenticated, login, register, logout, setUser } =
    useAuthStore();

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    setUser,
  };
}
