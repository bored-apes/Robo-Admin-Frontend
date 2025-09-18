import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchProfile } from '../services/authService';
import { ProfileResponse } from '@/types/authTypes';

export function useUserProfile() {
  const queryClient = useQueryClient();
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const { data, isLoading, isError, error, refetch } = useQuery<ProfileResponse>({
    queryKey: ['user-profile'],
    queryFn: () => {
      if (!token) throw new Error('No token');
      return fetchProfile(token);
    },
    enabled: !!token,
    retry: false,
  });

  return {
    profile: data?.data,
    isLoading,
    isError,
    error,
    refetch,
    setProfile: (profile: ProfileResponse) => {
      queryClient.setQueryData(['user-profile'], profile);
    },
    clearProfile: () => {
      queryClient.removeQueries({ queryKey: ['user-profile'] });
    },
  };
}
