'use client';
import { useInvestments } from '@/hooks/useInvestments';
import * as React from 'react';
import DataTable from '@/components/investment/DataTable';
import type { GridCellParams } from '@mui/x-data-grid';
import { formatDateHumanReadable } from '@/utils/date';
import {
  Box,
  CircularProgress,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Snackbar,
  Alert,
} from '@mui/material';

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
  const { investments, loading, error, refetch, updateInvestment, deleteInvestment } =
    useInvestments();

  const [deleting, setDeleting] = React.useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [deleteTargetId, setDeleteTargetId] = React.useState<number | null>(null);
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [selectedInvestment, setSelectedInvestment] = React.useState<any>(null);

  const [editFormData, setEditFormData] = React.useState({
    paymentDate: '',
    amount: '',
    modeOfPayment: '',
    category: '',
    payer: '',
    description: '',
  });

  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const handleEdit = (row: any) => {
    setSelectedInvestment(row);
    setEditFormData({
      paymentDate: row.paymentDate ? new Date(row.paymentDate).toISOString().split('T')[0] : '',
      amount: row.amount?.toString() || '',
      modeOfPayment: row.modeOfPayment || '',
      category: row.category || '',
      payer: row.payer || '',
      description: row.description || '',
    });
    setEditModalOpen(true);
  };

  const handleEditClose = () => {
    setEditModalOpen(false);
    setSelectedInvestment(null);
    setEditFormData({
      paymentDate: '',
      amount: '',
      modeOfPayment: '',
      category: '',
      payer: '',
      description: '',
    });
  };

  const handleEditSave = async () => {
    if (!selectedInvestment) return;
    try {
      const updateData = {
        paymentDate: editFormData.paymentDate
          ? new Date(editFormData.paymentDate).toISOString()
          : undefined,
        amount: parseFloat(editFormData.amount),
        modeOfPayment: editFormData.modeOfPayment,
        category: editFormData.category,
        payer: editFormData.payer,
        description: editFormData.description,
      };
      await updateInvestment(selectedInvestment.id, updateData);
      setSnackbar({
        open: true,
        message: 'Investment updated successfully!',
        severity: 'success',
      });
      handleEditClose();
      refetch();
    } catch (error) {
      console.error('Error updating investment:', error);
      setSnackbar({
        open: true,
        message: 'Failed to update investment',
        severity: 'error',
      });
    }
  };

  const handleDeleteRequest = (id: number) => {
    setDeleteTargetId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (deleteTargetId === null) return;
    try {
      setDeleting(deleteTargetId);
      await deleteInvestment(deleteTargetId);
      setSnackbar({
        open: true,
        message: 'Investment deleted successfully!',
        severity: 'success',
      });
      refetch();
    } catch (error) {
      console.error('Error deleting investment:', error);
      setSnackbar({
        open: true,
        message: 'Failed to delete investment',
        severity: 'error',
      });
    } finally {
      setDeleting(null);
      setDeleteDialogOpen(false);
      setDeleteTargetId(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setDeleteTargetId(null);
  };

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditFormData((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

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
        <Typography variant="h6" color="error" align="center">
          Error: {JSON.stringify(error)}
        </Typography>
      </Box>
    );

  return (
    <>
      <DataTable
        columns={columns}
        rows={investments}
        onEdit={handleEdit}
        onDelete={handleDeleteRequest}
        deleting={deleting}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Delete Investment</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this investment?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} disabled={!!deleting}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={!!deleting}
            sx={{
              backgroundColor: '#a10000',
              '&:hover': { backgroundColor: '#d32f2f' },
            }}
          >
            {deleting ? <CircularProgress size={20} /> : 'OK'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Investment Dialog */}
      <Dialog open={editModalOpen} onClose={handleEditClose} maxWidth="md" fullWidth>
        <DialogTitle>Edit Investment</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Payment Date"
                type="date"
                value={editFormData.paymentDate}
                onChange={handleInputChange('paymentDate')}
                InputLabelProps={{
                  shrink: true,
                  style: {
                    color: '#fff',
                    fontFamily: 'var(--font-geist-sans, Arial, sans-serif)',
                    fontWeight: 500,
                  },
                }}
                InputProps={{
                  style: {
                    color: '#fff',
                    fontFamily: 'var(--font-geist-sans, Arial, sans-serif)',
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Amount"
                type="number"
                value={editFormData.amount}
                onChange={handleInputChange('amount')}
                InputLabelProps={{
                  style: {
                    color: '#fff',
                    fontFamily: 'var(--font-geist-sans, Arial, sans-serif)',
                    fontWeight: 500,
                  },
                }}
                InputProps={{
                  style: {
                    color: '#fff',
                    fontFamily: 'var(--font-geist-sans, Arial, sans-serif)',
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Mode of Payment"
                value={editFormData.modeOfPayment}
                onChange={handleInputChange('modeOfPayment')}
                InputLabelProps={{
                  style: {
                    color: '#fff',
                    fontFamily: 'var(--font-geist-sans, Arial, sans-serif)',
                    fontWeight: 500,
                  },
                }}
                InputProps={{
                  style: {
                    color: '#fff',
                    fontFamily: 'var(--font-geist-sans, Arial, sans-serif)',
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Payer"
                value={editFormData.payer}
                onChange={handleInputChange('payer')}
                InputLabelProps={{
                  style: {
                    color: '#fff',
                    fontFamily: 'var(--font-geist-sans, Arial, sans-serif)',
                    fontWeight: 500,
                  },
                }}
                InputProps={{
                  style: {
                    color: '#fff',
                    fontFamily: 'var(--font-geist-sans, Arial, sans-serif)',
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Category"
                value={editFormData.category}
                onChange={handleInputChange('category')}
                InputLabelProps={{
                  style: {
                    color: '#fff',
                    fontFamily: 'var(--font-geist-sans, Arial, sans-serif)',
                    fontWeight: 500,
                  },
                }}
                InputProps={{
                  style: {
                    color: '#fff',
                    fontFamily: 'var(--font-geist-sans, Arial, sans-serif)',
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Description"
                value={editFormData.description}
                onChange={handleInputChange('description')}
                InputLabelProps={{
                  style: {
                    color: '#fff',
                    fontFamily: 'var(--font-geist-sans, Arial, sans-serif)',
                    fontWeight: 500,
                  },
                }}
                InputProps={{
                  style: {
                    color: '#fff',
                    fontFamily: 'var(--font-geist-sans, Arial, sans-serif)',
                  },
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
