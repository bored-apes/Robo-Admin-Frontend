"use client";
import * as React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';

export default function Header() {
  return (
  <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, background: '#151a2a' }}>
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 700, letterSpacing: 1 }}>
          Robo Admin Dashboard
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
      </Toolbar>
    </AppBar>
  );
}
