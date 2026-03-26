import {
  Dialog, DialogContent, DialogTitle, Typography, Divider,
  Stack, Box, Button, Chip
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DownloadIcon from '@mui/icons-material/Download';
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

export default function ReceiptModal({ receipt, onClose }) {
  const receiptRef = useRef(null);
  const deliveryFee = 45, handlingFee = 15;
  const formatINR = amt => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amt);

  const handlePrint = useReactToPrint({
    contentRef: receiptRef,
    documentTitle: "BookNest_Receipt",
    pageStyle: `
      @media print {
        body { background: #fff !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        * { color: #000 !important; background: transparent !important; }
        .receipt-box { border: 1px solid #ccc !important; border-radius: 8px !important; padding: 16px !important; margin-bottom: 16px !important; }
        .receipt-total { color: #b45309 !important; }
      }
    `,
    onPrintError: (loc, err) => { console.error("Print error:", loc, err); window.print(); }
  });

  return (
    <Dialog open fullWidth maxWidth="sm" onClose={onClose}>
      <DialogTitle sx={{ pb: 1 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <CheckCircleIcon color="success" sx={{ fontSize: 32 }} />
          <Typography variant="h6" fontWeight={700}>Payment Successful</Typography>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Box ref={receiptRef} sx={{ width: '100%' }}>
          <Chip label="SUCCESS" color="success" sx={{ mb: 2 }} />

          <Box className="receipt-box" sx={{ bgcolor: '#1a1a1a', p: 2, borderRadius: 2, mb: 2 }}>
            <Row label="Transaction ID" value={receipt.transactionId} />
            <Row label="Name" value={receipt.customerName} />
            <Row label="Email" value={receipt.email} />
            <Row label="Payment Method" value={receipt.paymentMethod} />
            <Row label="Date" value={new Date(receipt.createdAt).toLocaleString('en-IN')} />
          </Box>

          <Typography fontWeight={700} mb={1}>Order Summary</Typography>
          <Box className="receipt-box" sx={{ bgcolor: '#1a1a1a', borderRadius: 2, p: 2 }}>
            {receipt.items.map(({ title, name, quantity, price }, i) => (
              <Stack key={i} direction="row" justifyContent="space-between" py={0.8}>
                <Typography variant="body2">{(title || name || 'Book')} × {quantity}</Typography>
                <Typography variant="body2" fontWeight={600}>{formatINR(price * quantity)}</Typography>
              </Stack>
            ))}

            <Divider sx={{ my: 1 }} />
            <Row label="Delivery" value={formatINR(deliveryFee)} />
            <Row label="Handling" value={formatINR(handlingFee)} />
            <Divider sx={{ my: 1 }} />

            <Stack direction="row" justifyContent="space-between">
              <Typography fontWeight={700}>Total Paid</Typography>
              <Typography fontWeight={700} color="primary" className="receipt-total">
                {formatINR(receipt.amount + deliveryFee + handlingFee)}
              </Typography>
            </Stack>
          </Box>
        </Box>

        <Stack direction="row" spacing={2} mt={3}>
          <Button variant="outlined" onClick={onClose} fullWidth>Close</Button>
          <Button variant="contained" startIcon={<DownloadIcon />} onClick={handlePrint} fullWidth sx={{ fontWeight: 700 }}>
            Save Receipt
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

const Row = ({ label, value }) => (
  <Stack direction="row" justifyContent="space-between" py={0.5}>
    <Typography variant="body2" color="text.secondary">{label}</Typography>
    <Typography variant="body2" fontWeight={600}>{value}</Typography>
  </Stack>
);