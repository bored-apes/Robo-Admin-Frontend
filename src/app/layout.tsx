'use client';
import * as React from 'react';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import AppTheme from '../shared-theme/AppTheme';
import CssBaseline from '@mui/material/CssBaseline';
import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
} from '../components/customizations';
import AuthGuard from '../components/login/AuthGuard';
import { usePathname } from 'next/navigation';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SideMenu from '@/components/dashboard/SideMenu';
import AppNavbar from '@/components/dashboard/AppNavbar';
import { alpha, Box, Stack } from '@mui/material';
import Header from '@/components/dashboard/Header';

// Expose QueryClient for TanStack Query Devtools
declare global {
  interface Window {
    __TANSTACK_QUERY_CLIENT__: import('@tanstack/query-core').QueryClient;
  }
}

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isLogin = pathname === '/login';
  // Create a QueryClient instance (memoized to avoid recreation on every render)
  const [queryClient] = React.useState(() => new QueryClient());
  if (typeof window !== 'undefined') {
    window.__TANSTACK_QUERY_CLIENT__ = queryClient;
  }

  const xThemeComponents = {
    ...chartsCustomizations,
    ...dataGridCustomizations,
    ...datePickersCustomizations,
    ...treeViewCustomizations,
  };
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AppTheme themeComponents={xThemeComponents}>
          <CssBaseline enableColorScheme />
          <QueryClientProvider client={queryClient}>
            {isLogin ? (
              children
            ) : (
              <Box sx={{ display: 'flex' }}>
                <SideMenu />
                <AppNavbar />
                <Box
                  component="main"
                  sx={(theme) => ({
                    flexGrow: 1,
                    backgroundColor: theme.vars
                      ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
                      : alpha(theme.palette.background.default, 1),
                    overflow: 'auto',
                  })}
                >
                  <Stack
                    spacing={2}
                    sx={{
                      alignItems: 'center',
                      mx: 3,
                      pb: 5,
                      mt: { xs: 8, md: 0 },
                    }}
                  >
                    <Header />
                    <AuthGuard>{children}</AuthGuard>
                  </Stack>
                </Box>
              </Box>
            )}
          </QueryClientProvider>
        </AppTheme>
      </body>
    </html>
  );
}
