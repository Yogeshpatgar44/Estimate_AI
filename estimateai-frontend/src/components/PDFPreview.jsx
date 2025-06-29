import React from 'react';
import { Box, Typography, Divider, Paper } from '@mui/material';

const PDFPreview = ({ estimate }) => {
  if (!estimate) {
    return (
      <Typography color="error">
        Estimate data not available.
      </Typography>
    );
  }

  const items = estimate.items || [];
  const subtotal = items.reduce((acc, item) => acc + (item.quantity * item.unitCost), 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return (
    <Paper sx={{ p: 4 ,maxWidth: 800,margin: 'auto'}}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        PDF Preview
      </Typography>
      <Typography variant="body1" gutterBottom>
        This is how your estimate will appear when exported as a PDF. All customizations from the PDF Customization tab are reflected here.
      </Typography>

      <Divider sx={{ my: 2 }} />

      {/* Header / Company Info */}
      <Box>
        <Typography variant="h6" fontWeight="bold">
          Your Company Name
        </Typography>
        <Typography>123 Business Street, City, State 12345</Typography>
        <Typography>(555) 123-4567 | info@yourcompany.com</Typography>
        <Typography>www.yourcompany.com</Typography>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Estimate Info */}
      <Typography variant="h6" fontWeight="bold">ESTIMATE</Typography>
      <Typography>#{estimate._id?.slice(-10)}</Typography>
      <Typography>{new Date(estimate.createdAt).toLocaleDateString()}</Typography>

      <Box mt={3}>
        <Typography variant="subtitle1" fontWeight="bold">Bill To:</Typography>
        <Typography>{estimate.clientName}</Typography>
        <Typography>{estimate.title}</Typography>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Line Items */}
      {items.map((item, i) => (
        <Box key={i} display="flex" justifyContent="space-between" my={1}>
          <Typography>{item.item}</Typography>
          <Typography>{item.quantity}</Typography>
          <Typography>${item.unitCost.toFixed(2)}</Typography>
          <Typography>
            ${(item.quantity * item.unitCost).toFixed(2)}
          </Typography>
        </Box>
      ))}

      <Divider sx={{ my: 3 }} />

      {/* Totals */}
      <Box display="flex" justifyContent="flex-end" flexDirection="column" alignItems="end">
        <Typography>Subtotal: ${subtotal.toFixed(2)}</Typography>
        <Typography>Tax: ${tax.toFixed(2)}</Typography>
        <Typography fontWeight="bold">Total: ${total.toFixed(2)}</Typography>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Notes & Terms */}
      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
        Notes:
      </Typography>
      <Typography paragraph>
        {estimate.notes || 'This comprehensive construction estimate includes all major trades and materials for a complete kitchen renovation. Prices include standard grade materials and professional installation. Permit costs, appliances, and any structural engineering requirements are additional. Timeline: 4-6 weeks upon permit approval.'}
      </Typography>

      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
        Terms and Conditions:
      </Typography>
      <Typography paragraph>
        Payment is due within 30 days. This estimate is valid for 30 days.
      </Typography>

      <Typography variant="body2" mt={3}>
        Thank you for choosing our services!
      </Typography>
    </Paper>
  );
};

export default PDFPreview;
