"use client";
import * as React from 'react';
import { Box, Typography } from '@mui/material';

export default function Footer() {
  return (
    <Box component="footer" sx={{
      py: 1,
      px: 2,
      mt: 'auto',
      background: '#10121a',
      color: '#90caf9',
      textAlign: 'center',
      fontSize: 12,
      borderTop: '1px solid #23263a',
    }}>
      <Typography variant="caption" sx={{ fontSize: 12 }}>
        © {new Date().getFullYear()} Robo Admin. All rights reserved.
      </Typography>
    </Box>
  );
}
