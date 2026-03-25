import {
  Dialog, DialogContent, DialogTitle, Typography, Divider,
  Stack, Box, Button, Chip
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DownloadIcon from '@mui/icons-material/Download';

export default function ReceiptModal({ receipt, onClose }) {
  return (
    <Dialog open fullWidth maxWidth="sm" onClose={onClose}>
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={1}>
          <CheckCircleIcon color="success" sx={{ fontSize: 32 }} />
          <Typography variant="h6" fontWeight={700}>Payment Successful!</Typography>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Chip label="✅ SUCCESS" color="success" sx={{ mb: 2 }} />

        <Stack spacing={1} sx={{ bgcolor: '#f9f9f9', p: 2, borderRadius: 2, mb: 2 }}>
          <Row label="Transaction ID" value={receipt.transactionId} />
          <Row label="Name" value={receipt.customerName} />
          <Row label="Email" value={receipt.email} />
          <Row label="Payment Method" value={receipt.paymentMethod} />
          <Row label="Date" value={new Date(receipt.createdAt).toLocaleString()} />
        </Stack>

        <Typography fontWeight={700} mb={1}>Order Summary</Typography>
        {receipt.items.map(item => (
          <Stack key={item.name} direction="row" justifyContent="space-between" py={0.5}>
            <Typography variant="body2">{item.name} × {item.quantity}</Typography>
            <Typography variant="body2">${item.price.toFixed(2)}</Typography>
          </Stack>
        ))}
        <Divider sx={{ my: 1 }} />
        <Stack direction="row" justifyContent="space-between">
          <Typography fontWeight={700}>Total Paid</Typography>
          <Typography fontWeight={700} color="primary">${receipt.amount.toFixed(2)}</Typography>
        </Stack>

        <Stack direction="row" spacing={2} mt={3}>
          <Button variant="outlined" onClick={onClose} fullWidth>Close</Button>
          <Button variant="contained" startIcon={<DownloadIcon />}
            onClick={() => window.print()} fullWidth>
            Save Receipt
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

const Row = ({ label, value }) => (
  <Stack direction="row" justifyContent="space-between">
    <Typography variant="body2" color="text.secondary">{label}</Typography>
    <Typography variant="body2" fontWeight={600}>{value}</Typography>
  </Stack>
);