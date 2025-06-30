// import React, { useState } from 'react';
// import {
//   Box,
//   Typography,
//   TextField,
//   Button,
//   Paper,
//   Divider,
//   Grid,
// } from '@mui/material';

// const ExportShare = ({ estimate }) => {
//   const [email, setEmail] = useState(estimate?.clientEmail || '');
//   const [whatsapp, setWhatsapp] = useState('');
//   const [company, setCompany] = useState('Yogesh');
//   const [headerColor, setHeaderColor] = useState('#2563eb');
//   const [font, setFont] = useState('Inter (medium)');
//   const [orientation, setOrientation] = useState('portrait');

//   const handleExport = () => {
//     // You can add PDF generation logic here
//     alert('PDF Exported with custom settings!');
//   };

//   const handleEmailSend = () => {
//     // Replace this with actual email API or backend
//     alert(`Estimate sent to ${email}`);
//   };

//   const handleWhatsAppSend = () => {
//     // Replace this with WhatsApp integration
//     alert(`WhatsApp message sent to ${whatsapp}`);
//   };

//   return (
//     <Paper sx={{ p: 4 ,maxWidth: 1000,margin: 'auto' }}>
//       <Typography variant="h5" fontWeight="bold" gutterBottom>
//         Export & Share
//       </Typography>

//       <Divider sx={{ my: 3 }} />

//       <Typography variant="h6" gutterBottom>
//         Export Customized PDF
//       </Typography>
//       <Button variant="contained" color="primary" onClick={handleExport}>
//         Export Customized PDF
//       </Button>

//       <Divider sx={{ my: 3 }} />

//       <Typography variant="h6" gutterBottom>
//         Email to Client
//       </Typography>
//       <TextField
//         label="Client Email"
//         fullWidth
//         type="email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//         sx={{ mb: 2 }}
//       />
//       <Button variant="contained" color="secondary" onClick={handleEmailSend}>
//         Send via Email
//       </Button>

//       <Divider sx={{ my: 3 }} />

//       <Typography variant="h6" gutterBottom>
//         WhatsApp Number
//       </Typography>
//       <TextField
//         label="WhatsApp Number"
//         fullWidth
//         value={whatsapp}
//         onChange={(e) => setWhatsapp(e.target.value)}
//         sx={{ mb: 2 }}
//       />
//       <Button variant="contained" color="success" onClick={handleWhatsAppSend}>
//         Send via WhatsApp
//       </Button>

//       <Divider sx={{ my: 3 }} />

//       <Typography variant="h6" gutterBottom>
//         PDF Preview Settings
//       </Typography>
//       <Grid container spacing={2}>
//         <Grid item xs={12} sm={6}>
//           <TextField
//             label="Company"
//             fullWidth
//             value={company}
//             onChange={(e) => setCompany(e.target.value)}
//           />
//         </Grid>
//         <Grid item xs={12} sm={6}>
//           <TextField
//             label="Header Color"
//             fullWidth
//             type="color"
//             value={headerColor}
//             onChange={(e) => setHeaderColor(e.target.value)}
//             InputLabelProps={{ shrink: true }}
//           />
//         </Grid>
//         <Grid item xs={12} sm={6}>
//           <TextField
//             label="Font"
//             fullWidth
//             value={font}
//             onChange={(e) => setFont(e.target.value)}
//           />
//         </Grid>
//         <Grid item xs={12} sm={6}>
//           <TextField
//             label="Orientation"
//             fullWidth
//             value={orientation}
//             onChange={(e) => setOrientation(e.target.value)}
//           />
//         </Grid>
//       </Grid>
//     </Paper>
//   );
// };

// export default ExportShare;

import React, { useEffect, useRef, useState, useContext } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
  Grid,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import html2pdf from 'html2pdf.js';
import { AuthContext } from '../context/AuthContext';
import BASE_URL from '../services/api';

const ExportShare = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [estimate, setEstimate] = useState(null);
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [customization, setCustomization] = useState({
    companyInfo: { name: '' },
    styling: {
      headerColor: '#2563eb',
      fontFamily: 'Inter',
      fontSize: 'medium',
    },
    footer: {},
  });

  const pdfRef = useRef(); // PDF content container

  useEffect(() => {
    const fetchEstimate = async () => {
      try {
        const res = await fetch(`${BASE_URL}/estimates/${id}`, {
          headers: { Authorization: user?.token },
        });
        const data = await res.json();
        if (res.ok) {
          setEstimate(data);
          setEmail(data.clientEmail || '');
        }
      } catch (err) {
        console.error(err);
      }
    };

    if (id && user?.token) {
      fetchEstimate();
    }
  }, [id, user?.token]);

  useEffect(() => {
    const saved = localStorage.getItem('pdfCustomization');
    if (saved) setCustomization(JSON.parse(saved));
  }, []);

  const updateCustomization = (updated) => {
    const newCustomization = { ...customization, ...updated };
    setCustomization(newCustomization);
    localStorage.setItem('pdfCustomization', JSON.stringify(newCustomization));
  };

  const handleExport = () => {
    const opt = {
      margin: 0.5,
      filename: `${estimate?.title || 'estimate'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
    };

    html2pdf().set(opt).from(pdfRef.current).save();
  };

  const handleEmailSend = () => {
    alert(`Estimate sent to ${email}`);
  };

  const handleWhatsAppSend = () => {
    alert(`Estimate shared via WhatsApp to ${whatsapp}`);
  };

  if (!estimate) return null;

  const { companyInfo, styling, footer } = customization;
  const { name = 'Your Company Name', address = '', phone = '', email: emailC = '', website = '' } = companyInfo;

  const fontSizeMap = { small: '14px', medium: '16px', large: '18px' };
  const fontSize = fontSizeMap[styling.fontSize] || '16px';
  const fontFamily = styling.fontFamily || 'Inter';

  const items = [...(estimate.materials || []), ...(estimate.labor || []), ...(estimate.equipment || [])];
  const subtotal = items.reduce((acc, item) => acc + item.quantity * item.unitCost, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return (
    <Paper sx={{ p: 4, maxWidth: 1000, margin: 'auto' }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Export & Share
      </Typography>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" gutterBottom>Export Customized PDF</Typography>
      <Button variant="contained" color="primary" onClick={handleExport}>
        Export PDF
      </Button>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6">Email to Client</Typography>
      <TextField
        label="Client Email"
        fullWidth
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Button variant="contained" color="secondary" onClick={handleEmailSend}>
        Send via Email
      </Button>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6">WhatsApp Number</Typography>
      <TextField
        label="WhatsApp Number"
        fullWidth
        value={whatsapp}
        onChange={(e) => setWhatsapp(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Button variant="contained" color="success" onClick={handleWhatsAppSend}>
        Send via WhatsApp
      </Button>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6">PDF Preview Settings</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Company"
            fullWidth
            value={companyInfo.name}
            onChange={(e) =>
              updateCustomization({ companyInfo: { ...companyInfo, name: e.target.value } })
            }
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Header Color"
            type="color"
            fullWidth
            value={styling.headerColor}
            onChange={(e) =>
              updateCustomization({ styling: { ...styling, headerColor: e.target.value } })
            }
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Font"
            fullWidth
            value={styling.fontFamily}
            onChange={(e) =>
              updateCustomization({ styling: { ...styling, fontFamily: e.target.value } })
            }
          />
        </Grid>
      </Grid>

      {/* Hidden PDF Preview Container */}
      <Box
  ref={pdfRef}
  sx={{
    position: 'absolute',
    top: '-9999px', // Push it off-screen but still render
    left: 0,
    fontFamily,
    fontSize,
    width: '800px', // Required for proper rendering
    padding: 2,
    backgroundColor: '#fff', // Ensure background is white
  }}
>

        <Typography variant="h6" fontWeight="bold" color={styling.headerColor}>Estimate</Typography>
        <Typography>ID: #{estimate._id?.slice(-10)}</Typography>
        <Typography>{new Date(estimate.date).toLocaleDateString()}</Typography>
        <Typography>Bill To: {estimate.clientName}</Typography>
        <Typography>{estimate.title}</Typography>

        <Box mt={2}>
          <Typography variant="subtitle2" fontWeight="bold">{name}</Typography>
          <Typography>{address}</Typography>
          <Typography>{phone} | {emailC}</Typography>
          <Typography>{website}</Typography>
        </Box>

        <Divider sx={{ my: 1 }} />
        <Box display="flex" fontWeight="bold">
          <Box width="30%">Item</Box>
          <Box width="15%" textAlign="right">Qty</Box>
          <Box width="25%" textAlign="right">Unit Cost</Box>
          <Box width="30%" textAlign="right">Total</Box>
        </Box>

        {items.map((item, idx) => (
          <Box key={idx} display="flex" borderBottom="1px solid #ccc" py={0.5}>
            <Box width="30%">{item.item}</Box>
            <Box width="15%" textAlign="right">{item.quantity}</Box>
            <Box width="25%" textAlign="right">₹{item.unitCost.toFixed(2)}</Box>
            <Box width="30%" textAlign="right">₹{(item.quantity * item.unitCost).toFixed(2)}</Box>
          </Box>
        ))}

        <Box mt={2} textAlign="right">
          <Typography>Subtotal: ₹{subtotal.toFixed(2)}</Typography>
          <Typography>Tax (10%): ₹{tax.toFixed(2)}</Typography>
          <Typography fontWeight="bold">Total: ₹{total.toFixed(2)}</Typography>
        </Box>

        <Divider sx={{ my: 1 }} />
        <Typography variant="subtitle2" fontWeight="bold">Notes</Typography>
        <Typography>{estimate.notes}</Typography>
      </Box>
    </Paper>
  );
};

export default ExportShare;
