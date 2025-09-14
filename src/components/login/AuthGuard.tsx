import React from 'react';

import { useAuthCheck } from '../../hooks/useAuthCheck';
import { useRouter } from 'next/navigation';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { isLoggedIn, loading } = useAuthCheck();
  const router = useRouter();

  React.useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.replace('/login');
    }
  }, [isLoggedIn, loading, router]);

  if (loading || !isLoggedIn) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return <>{children}</>;
}
