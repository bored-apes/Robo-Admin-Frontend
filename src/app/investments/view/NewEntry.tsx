import React, { useState } from 'react';
import dayjs from 'dayjs';
import { createInvestment } from '@/services/investmentService';
import {
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Divider,
} from '@mui/material';
import CustomDatePicker from '../../../components/dashboard/CustomDatePicker';
import {
  ExpenseCategoryEnum,
  InvestmentCreateRequest,
  ModeOfPaymentEnum,
  PayerEnum,
} from '@/types/investmentTypes';

interface NewEntryProps {
  open: boolean;
  onClose: () => void;
}

const NewEntry: React.FC<NewEntryProps> = ({ open, onClose }) => {
  const [date, setDate] = useState<Date | null>(new Date());
  const [category, setCategory] = useState('');
  const [paymentMode, setPaymentMode] = useState('');
  const [payer, setPayer] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const handleReset = () => {
    setDate(null);
    setCategory('');
    setPaymentMode('');
    setPayer('');
    setAmount('');
    setDescription('');
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    // Validate required fields
    console.log({ date, category, paymentMode, payer, amount, description });
    if (!date || !category || !paymentMode || !payer || !amount || !description) {
      setError('Please fill all required fields.');
      setLoading(false);
      return;
    }
    const payload: InvestmentCreateRequest = {
      paymentDate: date,
      amount: Number(amount),
      modeOfPayment: paymentMode as ModeOfPaymentEnum,
      category: category as ExpenseCategoryEnum,
      payer: payer as PayerEnum,
      description: description || null,
    };
    try {
      await createInvestment(payload);
      setSuccess(true);
      handleReset();
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to create investment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          backgroundColor: 'background.paper',
          fontWeight: 600,
          fontSize: '1.25rem',
        }}
      >
        New Expense Entry
      </DialogTitle>

      <DialogContent sx={{ backgroundColor: 'background.paper', p: 3 }}>
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        {success && (
          <Typography color="primary" sx={{ mb: 2 }}>
            Investment entry created successfully!
          </Typography>
        )}
        <Box
          component="form"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2.5,
          }}
        >
          {/* Section 1: Date */}
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Date
            </Typography>
            <CustomDatePicker
              value={date ? dayjs(date) : undefined}
              onChange={(d) => setDate(d ? d.toDate() : null)}
            />
          </Box>

          <Divider />

          {/* Section 2: Payment Info */}
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Payment Information
            </Typography>

            <FormControl fullWidth>
              <InputLabel
                sx={{
                  top: '50%',
                  transform: 'translate(14px, -50%) scale(1)', // perfectly centered
                  '&.MuiInputLabel-shrink': {
                    top: 0,
                    transform: 'translate(14px, -9px) scale(0.75)', // normal float-up
                  },
                }}
              >
                Expense Category
              </InputLabel>
              <Select
                value={category}
                label="Expense Category"
                onChange={(e) => setCategory(e.target.value)}
              >
                {Object.entries(ExpenseCategoryEnum).map(([key, value]) => (
                  <MenuItem key={value} value={key}>
                    {value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel
                sx={{
                  top: '50%',
                  transform: 'translate(14px, -50%) scale(1)', // perfectly centered
                  '&.MuiInputLabel-shrink': {
                    top: 0,
                    transform: 'translate(14px, -9px) scale(0.75)', // normal float-up
                  },
                }}
              >
                Payment Mode
              </InputLabel>
              <Select
                value={paymentMode}
                label="Payment Mode"
                onChange={(e) => setPaymentMode(e.target.value)}
              >
                {Object.entries(ModeOfPaymentEnum).map(([key, value]) => (
                  <MenuItem key={value} value={key}>
                    {value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel
                sx={{
                  top: '50%',
                  transform: 'translate(14px, -50%) scale(1)', // perfectly centered
                  '&.MuiInputLabel-shrink': {
                    top: 0,
                    transform: 'translate(14px, -9px) scale(0.75)', // normal float-up
                  },
                }}
              >
                Payer
              </InputLabel>
              <Select value={payer} label="Payer" onChange={(e) => setPayer(e.target.value)}>
                {Object.entries(PayerEnum).map(([key, value]) => (
                  <MenuItem key={value} value={key}>
                    {value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Divider />

          {/* Section 3: Details */}
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Details
            </Typography>

            <TextField
              label="Amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              fullWidth
              sx={{
                '& .MuiInputLabel-outlined': {
                  top: '50%',
                  transform: 'translate(14px, -50%) scale(1)',
                },
                '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
                  top: 0,
                  transform: 'translate(14px, -9px) scale(0.75)',
                },
              }}
            />

            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              multiline
              sx={{
                '& .MuiInputLabel-outlined': {
                  top: '50%',
                  transform: 'translate(14px, -50%) scale(1)',
                },
                '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
                  top: 0,
                  transform: 'translate(14px, -9px) scale(0.75)',
                },
                mt: 2,
              }}
            />
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ backgroundColor: 'background.paper', p: 2 }}>
        <Button
          onClick={handleSave}
          variant="contained"
          color="primary"
          sx={{ borderRadius: 2 }}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save'}
        </Button>
        <Button onClick={handleReset} variant="outlined" color="secondary" sx={{ borderRadius: 2 }}>
          Reset
        </Button>
        <Button onClick={onClose} variant="text">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewEntry;
