'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

export function useAuth() {
  const { user, isLoading, isAuthenticated, loadUser, login, register, logout, setUser } =
    useAuthStore();

  useEffect(() => {
    loadUser();
  }, [loadUser]);

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
