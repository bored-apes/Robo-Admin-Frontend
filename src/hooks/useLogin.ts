import { useState } from 'react';
import { login, LoginRequest, LoginResponse } from '../services/authService';

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<LoginResponse | null>(null);

  const handleLogin = async (credentials: LoginRequest) => {
    setLoading(true);
    setError(null);
    try {
      const res = await login(credentials);
      setData(res);
      if (res.token) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', res.token);
        }
      }
      return res;
    } finally {
      setLoading(false);
    }
  };

  return { login: handleLogin, loading, error, data };
}
