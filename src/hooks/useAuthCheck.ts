import { useUserProfile } from './useUserProfile';

export function useAuthCheck() {
  const { profile, isLoading, isError, error } = useUserProfile();

  // If no token, not logged in and not loading
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (!token) {
    return {
      isLoggedIn: false,
      loading: false,
      error: null,
    };
  }

  return {
    isLoggedIn: !!profile,
    loading: isLoading,
    error: isError ? 'Invalid or expired token' : error,
  };
}
