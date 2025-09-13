"use client";
import * as React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { ComponentType, createElement } from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: ComponentType<{ fontSize?: "small" | "inherit" | "large" | "medium" }>;
  color: string;
}

export default function StatCard({ label, value, icon, color }: StatCardProps) {
  return (
    <Card sx={{ background: '#13151c', color: color, minHeight: 90, boxShadow: '0 2px 8px #0006', borderRadius: 2 }}>
      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2 }}>
        <Box sx={{ fontSize: 32, color }}>
          {icon ? createElement(icon, { fontSize: 'large' }) : null}
        </Box>
        <Box>
          <Typography variant="body2" sx={{ color: '#90caf9', fontSize: 13 }}>{label}</Typography>
          <Typography variant="h6" sx={{ color: '#E3F2FD', fontWeight: 700, fontSize: 18 }}>{value}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
