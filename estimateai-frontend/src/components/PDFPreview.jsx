// import React, { useEffect, useState } from 'react';
// import {
//   Box,
//   Typography,
//   Divider,
//   Paper,
// } from '@mui/material';

// const PDFPreview = ({ estimate }) => {
//   const [customization, setCustomization] = useState(null);

//   useEffect(() => {
//     const saved = localStorage.getItem('pdfCustomization');
//     if (saved) {
//       setCustomization(JSON.parse(saved));
//     }
//   }, []);

//   if (!estimate) {
//     return <Typography color="error">Estimate data not available.</Typography>;
//   }

//   const items = estimate.items || [];
//   const subtotal = items.reduce((acc, item) => acc + item.quantity * item.unitCost, 0);
//   const tax = subtotal * 0.1;
//   const total = subtotal + tax;

//   const {
//     companyInfo = {},
//     styling = {},
//     footer = {},
//   } = customization || {};

//   const {
//     name = 'Your Company Name',
//     phone = '(555) 123-4567',
//     address = '123 Business Street, City, State 12345',
//     email = 'info@yourcompany.com',
//     website = 'www.yourcompany.com',
//   } = companyInfo;

//   const headerColor = styling.headerColor || '#2563eb';
//   const accentColor = styling.accentColor || '#f59e0b';
//   const fontFamily = styling.fontFamily || 'Inter';
//   const fontSizeMap = {
//     small: '14px',
//     medium: '16px',
//     large: '18px',
//   };
//   const fontSize = fontSizeMap[styling.fontSize] || '16px';

//   return (
//     <Paper sx={{ p: 4, maxWidth: 1000, margin: 'auto', fontFamily, fontSize }}>
//       <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: headerColor }}>
//         PDF Preview
//       </Typography>
//       <Typography variant="body1" gutterBottom>
//         This is how your estimate will appear when exported as a PDF. All customizations are reflected here.
//       </Typography>

//       <Divider sx={{ my: 2 }} />

//       {/* Header / Company Info */}
//       <Box>
//         <Typography variant="h6" fontWeight="bold">{name}</Typography>
//         <Typography>{address}</Typography>
//         <Typography>{phone} | {email}</Typography>
//         <Typography>{website}</Typography>
//       </Box>

//       <Divider sx={{ my: 3 }} />

//       {/* Estimate Info */}
//       <Typography variant="h6" fontWeight="bold" sx={{ color: accentColor }}>ESTIMATE</Typography>
//       <Typography>#{estimate._id?.slice(-10)}</Typography>
//       <Typography>{new Date(estimate.createdAt).toLocaleDateString()}</Typography>

//       <Box mt={3}>
//         <Typography variant="subtitle1" fontWeight="bold">Bill To:</Typography>
//         <Typography>{estimate.clientName}</Typography>
//         <Typography>{estimate.title}</Typography>
//       </Box>

//       <Divider sx={{ my: 3 }} />

//       {/* Line Items */}
//       {items.map((item, i) => (
//         <Box key={i} display="flex" justifyContent="space-between" my={1}>
//           <Typography>{item.item}</Typography>
//           <Typography>{item.quantity}</Typography>
//           <Typography>₹{item.unitCost.toFixed(2)}</Typography>
//           <Typography>₹{(item.quantity * item.unitCost).toFixed(2)}</Typography>
//         </Box>
//       ))}

//       <Divider sx={{ my: 3 }} />

//       {/* Totals */}
//       <Box display="flex" justifyContent="flex-end" flexDirection="column" alignItems="end">
//         <Typography>Subtotal: ₹{subtotal.toFixed(2)}</Typography>
//         <Typography>Tax: ₹{tax.toFixed(2)}</Typography>
//         <Typography fontWeight="bold">Total: ₹{total.toFixed(2)}</Typography>
//       </Box>

//       <Divider sx={{ my: 3 }} />

//       {/* Notes */}
//       <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Notes:</Typography>
//       <Typography paragraph>
//         {estimate.notes || 'This estimate includes all costs. Adjustments, permits, and contingencies may apply.'}
//       </Typography>

//       {/* Terms */}
//       <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Terms and Conditions:</Typography>
//       <Typography paragraph>
//         {footer.terms || 'Payment is due within 30 days. This estimate is valid for 30 days.'}
//       </Typography>

//       {/* Footer Text */}
//       <Typography variant="body2" mt={3} sx={{ color: accentColor }}>
//         {footer.footerText || 'Thank you for choosing our services!'}
//       </Typography>
//     </Paper>
//   );
// };

// export default PDFPreview;

// src/pages/PDFPreview.jsx

import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Divider,
  Paper,
} from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import BASE_URL from '../services/api';

const PDFPreview = () => {
  const { id } = useParams(); // 👈 Get estimate ID from route
  const { user } = useContext(AuthContext);

  const [estimate, setEstimate] = useState(null);
  const [customization, setCustomization] = useState(null);

  // Load PDF customization (from localStorage)
  useEffect(() => {
    const saved = localStorage.getItem('pdfCustomization');
    if (saved) {
      setCustomization(JSON.parse(saved));
    }
  }, []);

  // Fetch estimate from backend
  useEffect(() => {
    const fetchEstimate = async () => {
      try {
        const res = await fetch(`${BASE_URL}/estimates/${id}`, {
          headers: {
            Authorization: user?.token,
          },
        });
        const data = await res.json();

        if (res.ok) {
          setEstimate(data);
        } else {
          console.error('Fetch error:', data.message);
        }
      } catch (err) {
        console.error('Fetch failed:', err);
      }
    };

    if (id && user?.token) {
      fetchEstimate();
    }
  }, [id, user?.token]);

  if (!estimate) {
    return <Typography color="error">Loading estimate...</Typography>;
  }

  // Extract customization info
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
  const fontSizeMap = { small: '14px', medium: '16px', large: '18px' };
  const fontSize = fontSizeMap[styling.fontSize] || '16px';

  const materials = estimate.materials || [];
  const labor = estimate.labor || [];
  const equipment = estimate.equipment || [];

  const items = [...materials, ...labor, ...equipment];

  const subtotal = items.reduce((acc, item) => acc + item.quantity * item.unitCost, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;


  return (
    <Paper sx={{ p: 4, maxWidth: 1000, margin: 'auto', fontFamily, fontSize }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: headerColor }}>
        PDF Preview
      </Typography>
      <Typography variant="body1" gutterBottom>
        This is how your estimate will appear when exported as a PDF.
      </Typography>

      <Divider sx={{ my: 2 }} />

      {/* Company Info */}
      <Box>
        <Typography variant="h6" fontWeight="bold">{name}</Typography>
        <Typography>{address}</Typography>
        <Typography>{phone} | {email}</Typography>
        <Typography>{website}</Typography>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Estimate Info */}
      <Typography variant="h6" fontWeight="bold" sx={{ color: accentColor }}>
          ESTIMATE
        </Typography>
        <Typography>ID: #{estimate._id?.slice(-10)}</Typography>
        <Typography>
          {estimate.date
            ? new Date(estimate.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })
            : 'Date not available'}
        </Typography>



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

      <Typography variant="body2" mt={3} sx={{ color: accentColor }}>
        {footer.footerText || 'Thank you for choosing our services!'}
      </Typography>
    </Paper>
  );
};

export default PDFPreview;
