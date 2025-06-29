import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
  Grid,
} from '@mui/material';

const ExportShare = ({ estimate }) => {
  const [email, setEmail] = useState(estimate?.clientEmail || '');
  const [whatsapp, setWhatsapp] = useState('');
  const [company, setCompany] = useState('Yogesh');
  const [headerColor, setHeaderColor] = useState('#2563eb');
  const [font, setFont] = useState('Inter (medium)');
  const [orientation, setOrientation] = useState('portrait');

  const handleExport = () => {
    // You can add PDF generation logic here
    alert('PDF Exported with custom settings!');
  };

  const handleEmailSend = () => {
    // Replace this with actual email API or backend
    alert(`Estimate sent to ${email}`);
  };

  const handleWhatsAppSend = () => {
    // Replace this with WhatsApp integration
    alert(`WhatsApp message sent to ${whatsapp}`);
  };

  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Export & Share
      </Typography>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" gutterBottom>
        Export Customized PDF
      </Typography>
      <Button variant="contained" color="primary" onClick={handleExport}>
        Export Customized PDF
      </Button>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" gutterBottom>
        Email to Client
      </Typography>
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

      <Typography variant="h6" gutterBottom>
        WhatsApp Number
      </Typography>
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

      <Typography variant="h6" gutterBottom>
        PDF Preview Settings
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Company"
            fullWidth
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Header Color"
            fullWidth
            type="color"
            value={headerColor}
            onChange={(e) => setHeaderColor(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Font"
            fullWidth
            value={font}
            onChange={(e) => setFont(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Orientation"
            fullWidth
            value={orientation}
            onChange={(e) => setOrientation(e.target.value)}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ExportShare;
