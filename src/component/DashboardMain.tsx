"use client";
import * as React from 'react';
import { Box } from '@mui/material';
import Grid from '@mui/material/Grid';
import StatCard from './StatCard';
import mockStats, { Stat } from '../mock/mockStats';

export default function DashboardMain() {
  return (
    <Box sx={{ flexGrow: 1, p: 2, background: '#181b23', minHeight: 'calc(100vh - 44px - 36px)' }}>
  <Grid container spacing={2}>
        {mockStats.map((stat: Stat) => (
          <Grid {...{ item: true, xs: 12, sm: 6, md: 3 }} key={stat.label}>
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
