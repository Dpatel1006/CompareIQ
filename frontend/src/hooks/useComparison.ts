'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

interface CreateComparisonInput {
  productNames: string[];
  preferences?: {
    budget?: string;
    priorities?: string[];
    useCase?: string;
  };
}

export function useCreateComparison() {
  return useMutation({
    mutationFn: async (input: CreateComparisonInput) => {
      const { data } = await api.post('/comparisons', input);
      return data;
    },
  });
}

export function useComparison(id: string) {
  return useQuery({
    queryKey: ['comparison', id],
    queryFn: async () => {
      const { data } = await api.get(`/comparisons/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useRelatedComparisons(id: string) {
  return useQuery({
    queryKey: ['comparison', id, 'related'],
    queryFn: async () => {
      const { data } = await api.get(`/comparisons/${id}/related`);
      return data;
    },
    enabled: !!id,
  });
}
