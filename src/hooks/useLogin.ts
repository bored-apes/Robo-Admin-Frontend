import { useMutation, useQueryClient } from '@tanstack/react-query';
import { login } from '../services/authService';
import { LoginRequest, ProfileResponse } from '@/types/authTypes';
export function useLogin() {
  const queryClient = useQueryClient();
  const mutation = useMutation<ProfileResponse, unknown, LoginRequest>({
    mutationFn: login,
    onSuccess: (data) => {
      if (data.data.token && typeof window !== 'undefined') {
        localStorage.setItem('token', data.data.token);
      }
      // Set user profile in React Query cache for global access
      queryClient.setQueryData(['user-profile'], data);
    },
  });

  return {
    login: mutation.mutateAsync,
    loading: mutation.isPending,
    error: mutation.error ? (mutation.error as Error).message || 'Login failed' : null,
    data: mutation.data,
  };
}
