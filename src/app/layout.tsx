'use client';
import * as React from 'react';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import MuiRootLayout from '../layout/RootLayout';
import AuthGuard from '../components/login/AuthGuard';
import { usePathname } from 'next/navigation';

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
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <MuiRootLayout>{isLogin ? children : <AuthGuard>{children}</AuthGuard>}</MuiRootLayout>
      </body>
    </html>
  );
}
