//frontend/src/components/PaymentModal.jsx
import { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, TextField,
  Button, Stack, Typography, CircularProgress,
  FormControlLabel, Checkbox, Divider, Box,
  InputAdornment
} from '@mui/material';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import LockIcon from '@mui/icons-material/Lock';
import axios from 'axios';
import { clearCart } from '../api/cart'; // ← import your clear cart API

export default function PaymentModal({ open, onClose, orderData, onSuccess }) {
  const [form, setForm] = useState({
    cardNumber: '', expiry: '', cvv: '', sendEmail: true,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const formatCard = (val) =>
    val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();

  const formatExpiry = (val) => {
    const clean = val.replace(/\D/g, '').slice(0, 4);
    return clean.length > 2 ? `${clean.slice(0, 2)}/${clean.slice(2)}` : clean;
  };

  const validate = () => {
    const e = {};
    if (form.cardNumber.replace(/\s/g, '').length !== 16) e.cardNumber = 'Must be 16 digits';
    if (!form.expiry.match(/^\d{2}\/\d{2}$/)) e.expiry = 'Format: MM/YY';
    if (form.cvv.length < 3) e.cvv = 'Invalid CVV';
    setErrors(e);
    return Object.keys(e).length === 0;
  };
const handlePay = async () => {
  if (!validate()) return;
  setLoading(true);
  const token = localStorage.getItem('token');

  try {
    const { data } = await axios.post(
      'http://localhost:5000/api/payment/process',
      {
        // ✅ Removed customerName & email — backend gets from req.user
        amount: orderData.total,
        currency: 'INR',
        items: orderData.items,
        cardLast4: form.cardNumber.replace(/\s/g, '').slice(-4),
        sendEmail: form.sendEmail,
        address: orderData.address,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    await clearCart(token);
    onSuccess(data.receipt);
  } catch {
    alert('Payment failed. Please try again.');
  } finally {
    setLoading(false);
  }
};

  if (!orderData) return null;

  return (
    <Dialog open={open} onClose={!loading ? onClose : undefined} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={1}>
          <LockIcon color="primary" />
          <Typography fontWeight={700}>Complete Payment</Typography>
        </Stack>
      </DialogTitle>

      <DialogContent>

        {/* Order Summary */}
        <Box sx={{ bgcolor: '#f5f5f5', borderRadius: 2, p: 2, mb: 3 }}>
          <Typography variant="body2" color="text.secondary" mb={1} fontWeight={600}>
            Order Summary
          </Typography>
          {orderData.items?.map((item, i) => (
            <Stack key={i} direction="row" justifyContent="space-between">
              <Typography variant="body2">
                {item.title || 'Book'} × {item.quantity}
              </Typography>
              <Typography variant="body2">
                ₹{((item.price || 0) * (item.quantity || 0)).toFixed(2)}
              </Typography>
            </Stack>
          ))}
          <Divider sx={{ my: 1 }} />

          {/* Fee Breakdown */}
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" color="text.secondary">Shipping</Typography>
            <Typography variant="body2">₹{orderData.shipping?.toFixed(2)}</Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" color="text.secondary">Handling Fee</Typography>
            <Typography variant="body2">₹{orderData.handlingFee?.toFixed(2)}</Typography>
          </Stack>

          <Divider sx={{ my: 1 }} />
          <Stack direction="row" justifyContent="space-between">
            <Typography fontWeight={700}>Total</Typography>
            <Typography fontWeight={700} color="primary">
              ₹{orderData.total?.toFixed(2)}
            </Typography>
          </Stack>
        </Box>

        {/* Delivering To */}
        <Box sx={{ bgcolor: '#f9f9f9', borderRadius: 2, p: 2, mb: 3 }}>
          <Typography variant="body2" color="text.secondary" fontWeight={600} mb={0.5}>
            Delivering To
          </Typography>
          <Typography variant="body2">
            {orderData.address?.name} · {orderData.address?.phone}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {orderData.address?.street}, {orderData.address?.city},
            {orderData.address?.state} - {orderData.address?.pincode}
          </Typography>
        </Box>

        {/* Card Fields */}
        <Stack spacing={2}>
          <TextField
            label="Card Number"
            value={form.cardNumber}
            onChange={e => setForm({ ...form, cardNumber: formatCard(e.target.value) })}
            error={!!errors.cardNumber}
            helperText={errors.cardNumber}
            placeholder="1234 5678 9012 3456"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end"><CreditCardIcon /></InputAdornment>
              )
            }}
            fullWidth
          />
          <Stack direction="row" spacing={2}>
            <TextField
              label="Expiry"
              value={form.expiry}
              onChange={e => setForm({ ...form, expiry: formatExpiry(e.target.value) })}
              error={!!errors.expiry}
              helperText={errors.expiry}
              placeholder="MM/YY"
              fullWidth
            />
            <TextField
              label="CVV"
              value={form.cvv}
              onChange={e => setForm({ ...form, cvv: e.target.value.slice(0, 4) })}
              error={!!errors.cvv}
              helperText={errors.cvv}
              type="password"
              fullWidth
            />
          </Stack>

          <FormControlLabel
            control={
              <Checkbox
                checked={form.sendEmail}
                onChange={e => setForm({ ...form, sendEmail: e.target.checked })}
              />
            }
            label="Email me a receipt"
          />

          <Stack direction="row" spacing={2}>
            <Button variant="outlined" onClick={onClose} disabled={loading} fullWidth>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handlePay}
              disabled={loading}
              fullWidth
              sx={{ py: 1.5, fontWeight: 700 }}
            >
              {loading
                ? <><CircularProgress size={18} sx={{ mr: 1, color: 'white' }} />Processing...</>
                : `Pay ₹${orderData.total?.toFixed(2)}`
              }
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}