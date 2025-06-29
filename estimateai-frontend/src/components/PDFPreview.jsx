import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Divider,
  Paper,
} from '@mui/material';

const PDFPreview = ({ estimate }) => {
  const [customization, setCustomization] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('pdfCustomization');
    if (saved) {
      setCustomization(JSON.parse(saved));
    }
  }, []);

  if (!estimate) {
    return <Typography color="error">Estimate data not available.</Typography>;
  }

  const items = estimate.items || [];
  const subtotal = items.reduce((acc, item) => acc + item.quantity * item.unitCost, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const {
    companyInfo = {},
    styling = {},
    footer = {},
  } = customization || {};

  const {
    name = 'Your Company Name',
    phone = '(555) 123-4567',
    address = '123 Business Street, City, State 12345',
    email = 'info@yourcompany.com',
    website = 'www.yourcompany.com',
  } = companyInfo;

  const headerColor = styling.headerColor || '#2563eb';
  const accentColor = styling.accentColor || '#f59e0b';
  const fontFamily = styling.fontFamily || 'Inter';
  const fontSizeMap = {
    small: '14px',
    medium: '16px',
    large: '18px',
  };
  const fontSize = fontSizeMap[styling.fontSize] || '16px';

  return (
    <Paper sx={{ p: 4, maxWidth: 800, margin: 'auto', fontFamily, fontSize }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: headerColor }}>
        PDF Preview
      </Typography>
      <Typography variant="body1" gutterBottom>
        This is how your estimate will appear when exported as a PDF. All customizations are reflected here.
      </Typography>

      <Divider sx={{ my: 2 }} />

      {/* Header / Company Info */}
      <Box>
        <Typography variant="h6" fontWeight="bold">{name}</Typography>
        <Typography>{address}</Typography>
        <Typography>{phone} | {email}</Typography>
        <Typography>{website}</Typography>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Estimate Info */}
      <Typography variant="h6" fontWeight="bold" sx={{ color: accentColor }}>ESTIMATE</Typography>
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
          <Typography>₹{item.unitCost.toFixed(2)}</Typography>
          <Typography>₹{(item.quantity * item.unitCost).toFixed(2)}</Typography>
        </Box>
      ))}

      <Divider sx={{ my: 3 }} />

      {/* Totals */}
      <Box display="flex" justifyContent="flex-end" flexDirection="column" alignItems="end">
        <Typography>Subtotal: ₹{subtotal.toFixed(2)}</Typography>
        <Typography>Tax: ₹{tax.toFixed(2)}</Typography>
        <Typography fontWeight="bold">Total: ₹{total.toFixed(2)}</Typography>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Notes */}
      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Notes:</Typography>
      <Typography paragraph>
        {estimate.notes || 'This estimate includes all costs. Adjustments, permits, and contingencies may apply.'}
      </Typography>

      {/* Terms */}
      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Terms and Conditions:</Typography>
      <Typography paragraph>
        {footer.terms || 'Payment is due within 30 days. This estimate is valid for 30 days.'}
      </Typography>

      {/* Footer Text */}
      <Typography variant="body2" mt={3} sx={{ color: accentColor }}>
        {footer.footerText || 'Thank you for choosing our services!'}
      </Typography>
    </Paper>
  );
};

export default PDFPreview;
