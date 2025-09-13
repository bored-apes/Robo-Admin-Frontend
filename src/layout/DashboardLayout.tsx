'use client';
import * as React from 'react';
import { Box } from '@mui/material';

import Sidebar from '../component/Sidebar';
import Dashboard from '../component/Dashboard';

export default function DashboardLayout() {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#10121a' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Dashboard />
      </Box>
    </Box>
  );
}
