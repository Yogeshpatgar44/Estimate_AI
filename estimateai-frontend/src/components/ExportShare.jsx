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
import PDFPreview from '../components/PDFPreview';

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

  const previewRef = useRef();

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


  const handleExport = () => {
    if (!previewRef.current) return alert('Nothing to export');
    html2pdf()
      .from(previewRef.current)
      .set({
        margin: 10,
        filename: 'estimate.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, logging: true, useCORS: true },
        jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' },
      })
      .save();
  };

  const handleEmailSend = () => {
    alert(`Estimate sent to ${email}`);
  };

  const handleWhatsAppSend = () => {
    alert(`Estimate shared via WhatsApp to ${whatsapp}`);
  };

  if (!estimate) return <Typography>Loading...</Typography>;

  const { companyInfo, styling } = customization;

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

      {/* Hidden PDF Preview Rendered Off-Screen */}
      <div style={{
        position: 'absolute',
        top: '-9999px',
        left: '-9999px',
        width: '800px',
        backgroundColor: '#fff',
        padding: '16px',
      }}>
        <div ref={previewRef}>
          <PDFPreview estimate={estimate} customization={customization} />
        </div>
      </div>

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

      <Typography variant="h6" gutterBottom>PDF Preview Settings</Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, pl: 1 }}>
        <Typography variant="body1">
          <strong>Company:</strong> {companyInfo.name}
        </Typography>

        <Typography variant="body1">
          <strong>Header Color:</strong> 
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              Header Color:
            </Typography>
            <Box
              sx={{
                width: 20,
                height: 20,
                backgroundColor: styling.headerColor,
                border: '1px solid #ccc',
              }}
            />
          
            <Typography variant="body1">{styling.headerColor}</Typography>
              </Box>

                </Typography>

                <Typography variant="body1">
                  <strong>Font:</strong> {styling.fontFamily}
                </Typography>

                <Typography variant="body1">
                  <strong>Orientation:</strong> {styling.orientation || 'portrait'}
                </Typography>
              </Box>

    </Paper>
  );
};

export default ExportShare;
