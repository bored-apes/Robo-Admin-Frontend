import { useEffect, useState } from 'react';
import { fetchProfile } from '../services/authService';

export function useAuthCheck() {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      setLoading(false);
      setIsLoggedIn(false);
      return;
    }
    fetchProfile(token)
      .then(() => {
        setIsLoggedIn(true);
        setLoading(false);
      })
      .catch(() => {
        setIsLoggedIn(false);
        setLoading(false);
        setError('Invalid or expired token');
        localStorage.removeItem('token');
      });
  }, []);

  return { isLoggedIn, loading, error };
}
