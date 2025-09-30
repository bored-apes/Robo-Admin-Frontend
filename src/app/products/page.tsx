'use client';
import * as React from 'react';
import { Box } from '@mui/material';
import ProductsTable from '../../components/products/ProductsTable';

export default function ProductsPage() {
  return (
    <Box sx={{ p: 3, height: '100vh' }}>
      <ProductsTable />
    </Box>
  );
}
