'use client';
import * as React from 'react';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import MuiRootLayout from '../layout/RootLayout';
import AuthGuard from '../components/login/AuthGuard';
import { usePathname } from 'next/navigation';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

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

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <MuiRootLayout>
          <QueryClientProvider client={queryClient}>
            {isLogin ? children : <AuthGuard>{children}</AuthGuard>}
          </QueryClientProvider>
        </MuiRootLayout>
      </body>
    </html>
  );
}
