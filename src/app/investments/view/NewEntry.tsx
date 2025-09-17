import React, { useState } from 'react';
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

enum ExpenseCategoryEnum {
  Samples_ProductTesting = 'Samples/Product Testing',
  StockPurchase_ChinaImports = 'Stock Purchase/China Imports',
  Website_Domain_Hosting = 'Website/Domain/Hosting',
  GST_CA_ConsultantFees = 'GST/CA/Consultant Fees',
  Warehouse_GodownRent = 'Warehouse/Godown Rent',
  Machinery_Tools = 'Machinery/Tools',
  Transport_PetrolDiesel_LocalDelivery = 'Transport/Petrol/Diesel/Local Delivery',
  Designs_Branding_Labels = 'Designs/Branding/Labels',
  Marketing_Advertising_Online_Offline = 'Marketing/Advertising Online/Offline',
  OfficeExpenses_Stationery_Electricity_Internet = 'Office Expenses/Stationery/Electricity/Internet',
  PackagingMaterial = 'Packaging Material',
  StaffSalary_LabourCharges = 'Staff Salary/Labour Charges',
  Bills_Electricity_Phone_Water = 'Bills/Electricity/Phone/Water',
  CompanyRegistration_LegalFees = 'Company Registration/Legal Fees',
  BankCharges_ForexFees = 'Bank Charges/Forex Fees',
  CustomerRefunds_Returns = 'Customer Refunds/Returns',
  Add_CompanyBalance = 'Added Into Company Balance',
  Other_Miscellaneous = 'Other/Miscellaneous',
}

enum ModeOfPaymentEnum {
  UPI = 'UPI',
  Cash = 'Cash',
  Card = 'Card',
  BankTransfer = 'Bank Transfer',
  NetBanking = 'Net Banking',
  WireTransfer = 'Wire Transfer',
  Paypal = 'Paypal',
  Cheque = 'Cheque',
  DemandDraft = 'Demand Draft',
  NEFT = 'NEFT',
  RTGS = 'RTGS',
  IMPS = 'IMPS',
  Other = 'Other',
}

const payers = ['Bhargav', 'Jay', 'Shivam', 'Sahil', 'Company'];

interface NewEntryProps {
  open: boolean;
  onClose: () => void;
}

const NewEntry: React.FC<NewEntryProps> = ({ open, onClose }) => {
  const [date, setDate] = useState<Date | null>(null);
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

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Save logic here
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
            <CustomDatePicker />
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
                  <MenuItem key={key} value={value}>
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
                  <MenuItem key={key} value={value}>
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
                {payers.map((p) => (
                  <MenuItem key={p} value={p}>
                    {p}
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
        <Button onClick={handleSave} variant="contained" color="primary" sx={{ borderRadius: 2 }}>
          Save
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
