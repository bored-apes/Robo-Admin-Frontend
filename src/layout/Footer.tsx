"use client";
import * as React from 'react';
import { Box, Typography } from '@mui/material';

export default function Footer() {
  return (
    <Box component="footer" sx={{
      py: 2,
      px: 3,
      mt: 'auto',
      background: '#151a2a',
      color: '#E3F2FD',
      textAlign: 'center',
    }}>
      <Typography variant="body2">
        © {new Date().getFullYear()} Robo Admin. All rights reserved.
      </Typography>
    </Box>
  );
}
