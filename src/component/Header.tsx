"use client";
import * as React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';

export default function Header() {
  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, background: '#10121a', boxShadow: '0 2px 8px #000a' }}>
      <Toolbar variant="dense" sx={{ minHeight: 44 }}>
        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 700, letterSpacing: 1, fontSize: 18 }}>
          Robo Admin
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
      </Toolbar>
    </AppBar>
  );
}
