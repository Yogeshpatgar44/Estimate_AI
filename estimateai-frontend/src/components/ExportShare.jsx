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

  const generatePDFBase64 = async () => {
    if (!previewRef.current) return null;
    const element = previewRef.current;
  
    const opt = {
      margin: 10,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' }
    };
  
    const worker = html2pdf().set(opt).from(element);
    const pdfBlob = await worker.outputPdf('blob');
    
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result); // base64 string
      reader.readAsDataURL(pdfBlob);
    });
  };
  
  
  const handleEmailSend = async () => {
    try {
      const pdfBase64 = await generatePDFBase64();
  
      if (!pdfBase64) {
        alert('PDF generation failed.');
        return;
      }
  
      const response = await fetch(`${BASE_URL}/estimates/${id}/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: user?.token,
        },
        body: JSON.stringify({
          toEmail: email,
          subject: 'Your Estimate PDF',
          html: '<p>Please find your estimate attached.</p>',
          attachment: {
            filename: 'estimate.pdf',
            content: pdfBase64.split(',')[1], // remove `data:application/pdf;base64,` prefix
          },
        }),
      });
  
      console.log('PDF Base64 size:', pdfBase64.length);
  
      const data = await response.json();
      if (response.ok) {
        alert('Email sent successfully!');
      } else {
        alert('Failed to send email: ' + (data?.message || 'Unknown error'));
      }
    } catch (err) {
      console.error(err);
      alert('Email failed to send PDF.');
    }
  };
  
  
  if (!estimate) return <Typography></Typography>;

  const { companyInfo, styling } = customization;

  return (
    <Paper sx={{ p: 4, maxWidth: 1000, margin: 'auto' }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Export & Share
      </Typography>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" gutterBottom >Export Customized PDF
      <Button variant="contained" color="primary" onClick={handleExport} sx={{ml:8}}>
        Export PDF
      </Button>

      </Typography>
      

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
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={{ mb: 2,mr:5 }}
      />
      <Button variant="contained" color="secondary" onClick={handleEmailSend}>
        Send via Email
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
