"use client";
import * as React from 'react';
import { Box } from '@mui/material';
import Sidebar from '../component/Sidebar';

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#10121a' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {children}
      </Box>
    </Box>
  );
}
