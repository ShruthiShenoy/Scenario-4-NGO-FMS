import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  Container,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from '@mui/material';

export interface PayableFormData {
  vendorName: string;
  vendorEmail: string;
  vendorNumber: string;
  invoiceId: string;
  invoiceDate: string;
  dueDate?: string;
  paymentMethod?: string;
  paymentStatus: string;
  createdBy: string;
  amount: number;
}

interface PayableFormProps {
  onSubmit: (data: PayableFormData) => Promise<void>;
}

const PayableForm: React.FC<PayableFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<PayableFormData>({
    vendorName: '',
    vendorEmail: '',
    vendorNumber: '',
    invoiceId: '',
    invoiceDate: '',
    dueDate: '',
    paymentMethod: '',
    paymentStatus: '',
    createdBy: '',
    amount: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const isValidDate = (dateString: string) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) return false;
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(dateString);
    return (
      date.getFullYear() === year &&
      date.getMonth() + 1 === month &&
      date.getDate() === day
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'vendorName' && /[^a-zA-Z\s]/.test(value)) return;
    if (name === 'vendorNumber' && /[^0-9]/.test(value)) return; // Only digits
    if (name === 'invoiceId' && /[^0-9]/.test(value)) return; // Only digits
    if (name === 'amount' && /[^0-9.]/.test(value)) return;
    if (name === 'createdBy' && /[^a-zA-Z\s]/.test(value)) return;

    if ((name === 'invoiceDate' || name === 'dueDate') && value !== '') {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleDateBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (value === '') return;

    if (!isValidDate(value)) {
      setError(
        `Invalid date entered for ${
          name === 'invoiceDate' ? 'Invoice Date' : 'Due Date'
        }. Please enter a valid date.`
      );
      setTimeout(() => setError(null), 4000);
      setFormData((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const {
      vendorName,
      vendorEmail,
      vendorNumber,
      invoiceId,
      invoiceDate,
      dueDate,
      paymentStatus,
      createdBy,
      amount,
    } = formData;

    if (
      !vendorName.trim() ||
      !vendorEmail.trim() ||
      !vendorNumber.trim() ||
      !invoiceId.trim() ||
      !invoiceDate.trim() ||
      !paymentStatus.trim() ||
      !createdBy.trim() ||
      !amount
    ) {
      setError('Please fill in all required fields.');
      return;
    }

    if (!/^\d{10}$/.test(vendorNumber)) {
      setError('Vendor Number must be a valid 10-digit number.');
      return;
    }

    if (!/^\d+$/.test(invoiceId)) {
      setError('Invoice ID must contain only digits.');
      return;
    }

    if (!isValidDate(invoiceDate)) {
      setError('Invalid Invoice Date. Please correct and try again.');
      return;
    }

    if (dueDate && dueDate.trim() !== '' && !isValidDate(dueDate)) {
      setError('Invalid Due Date. Please correct and try again.');
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
      setSuccess('Payable created successfully!');
      setFormData({
        vendorName: '',
        vendorEmail: '',
        vendorNumber: '',
        invoiceId: '',
        invoiceDate: '',
        dueDate: '',
        paymentMethod: '',
        paymentStatus: '',
        createdBy: '',
        amount: 0,
      });
      setTimeout(() => setSuccess(null), 3000);
    } catch {
      setError('Failed to create payable. Please try again.');
      setTimeout(() => setError(null), 3000);
    }
    setLoading(false);
  };

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bgcolor: '#F4EBDC',
        overflowY: 'auto',
        paddingTop: 8,
        paddingBottom: 8,
      }}
    >
      <Container maxWidth="sm">
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            border: '2px solid #8B5E3B',
            borderRadius: 2,
            bgcolor: '#F4EBDC',
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <Typography variant="h5" align="center" sx={{ color: '#8B5E3B', mb: 1 }}>
            Payable Invoice
          </Typography>

          <TextField label="Vendor Name" name="vendorName" value={formData.vendorName} onChange={handleInputChange} required fullWidth />
          <TextField label="Vendor Email" name="vendorEmail" type="email" value={formData.vendorEmail} onChange={handleInputChange} required fullWidth />
          <TextField label="Vendor Number" name="vendorNumber" value={formData.vendorNumber} onChange={handleInputChange} required fullWidth />
          <TextField label="Invoice ID" name="invoiceId" value={formData.invoiceId} onChange={handleInputChange} required fullWidth />
          <TextField
            label="Invoice Date"
            name="invoiceDate"
            type="date"
            value={formData.invoiceDate}
            onChange={handleInputChange}
            onBlur={handleDateBlur}
            required
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Due Date"
            name="dueDate"
            type="date"
            value={formData.dueDate || ''}
            onChange={handleInputChange}
            onBlur={handleDateBlur}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />

          <FormControl fullWidth>
            <InputLabel>Payment Method</InputLabel>
            <Select
              name="paymentMethod"
              value={formData.paymentMethod || ''}
              label="Payment Method"
              onChange={handleSelectChange}
            >
              <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
              <MenuItem value="Cash">Cash</MenuItem>
              <MenuItem value="Cheque">Cheque</MenuItem>
              <MenuItem value="UPI">UPI</MenuItem>
              <MenuItem value="Net Banking">Net Banking</MenuItem>
              <MenuItem value="Credit/Debit Card">Credit/Debit Card</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Payment Status</InputLabel>
            <Select
              name="paymentStatus"
              value={formData.paymentStatus}
              label="Payment Status"
              onChange={handleSelectChange}
              required
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Paid">Paid</MenuItem>
              <MenuItem value="Overdue">Overdue</MenuItem>
            </Select>
          </FormControl>

          <TextField label="Amount" name="amount" type="text" value={formData.amount === 0 ? '' : String(formData.amount)} onChange={handleInputChange} required fullWidth />
          <TextField label="Created By" name="createdBy" value={formData.createdBy} onChange={handleInputChange} required fullWidth />

          <Button
            type="submit"
            variant="contained"
            sx={{ bgcolor: '#8B5E3B', color: '#fff', '&:hover': { bgcolor: '#7A4E31' } }}
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </Button>

          {(error || success) && (
            <Box
              sx={{
                textAlign: 'center',
                color: error ? '#E63946' : '#2A9D8F',
                fontWeight: 'medium',
                fontSize: '1rem',
                mt: 1,
              }}
            >
              {error || success}
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default PayableForm;
