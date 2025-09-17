'use client';
import { useInvestments } from '@/hooks/useInvestments';
import * as React from 'react';
import DataTable from '@/components/investment/DataTable';
import type { GridCellParams } from '@mui/x-data-grid';
import { formatDateHumanReadable } from '@/utils/date';
import { Box, CircularProgress, Typography } from '@mui/material';

const columns = [
  {
    field: 'paymentDate',
    headerName: 'Payment Date',
    flex: 1,
    minWidth: 100,
    renderCell: (params: GridCellParams) => formatDateHumanReadable(params.value as string | Date),
  },
  { field: 'amount', headerName: 'Amount', flex: 1, minWidth: 100 },
  { field: 'modeOfPayment', headerName: 'Mode', flex: 1, minWidth: 100 },
  { field: 'category', headerName: 'Category', flex: 2, minWidth: 250 },
  { field: 'payer', headerName: 'Payer', flex: 1, minWidth: 100 },
  { field: 'description', headerName: 'Description', flex: 2, minWidth: 250 },
];

export default function InvestmentsTable() {
  const { investments, loading, error } = useInvestments();

  if (loading)
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        width="100vw"
      >
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        minHeight="40vh"
        width="100vw"
      >
        <Box>
          <Typography variant="h6" color="error" align="center">
            Error: {JSON.stringify(error)}
          </Typography>
        </Box>
      </Box>
    );

  return <DataTable columns={columns} rows={investments} />;
}
