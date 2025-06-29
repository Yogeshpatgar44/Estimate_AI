import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Divider,
  Button,
  Grid,
  Paper,
} from '@mui/material';
import jsPDF from 'jspdf';

const EstimateDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [estimate, setEstimate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEstimate = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/estimates/${id}`);
        const data = await res.json();
        setEstimate(data);
      } catch (err) {
        console.error('Failed to load estimate', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEstimate();
  }, [id]);

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text('Estimate Details', 10, 10);
    doc.text(`Client: ${estimate.clientName || 'N/A'}`, 10, 20);
    doc.text(`Email: ${estimate.clientEmail || 'N/A'}`, 10, 30);
    doc.text(`Project: ${estimate.input}`, 10, 40);

    let y = 50;
    doc.text('Materials:', 10, y);
    estimate.materials?.forEach((mat) => {
      y += 10;
      doc.text(`- ${mat.item}: ${mat.quantity} x ₹${mat.rate}`, 10, y);
    });

    y += 10;
    doc.text('Labor:', 10, y);
    estimate.labor?.forEach((lab) => {
      y += 10;
      doc.text(`- ${lab.item || lab.role}: ${lab.quantity || lab.days} x ₹${lab.rate || lab.dailyRate}`, 10, y);
    });

    y += 20;
    doc.text(`Total: ₹${estimate.totalCost}`, 10, y);
    doc.save('Estimate_Details.pdf');
  };

  if (loading) {
    return (
      <Box p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!estimate) {
    return (
      <Box p={4}>
        <Typography variant="h6" color="error">Estimate not found.</Typography>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
        Estimate Details
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle1">Project: <strong>{estimate.input}</strong></Typography>
        <Typography>Client: {estimate.clientName || 'N/A'}</Typography>
        <Typography>Email: {estimate.clientEmail || 'N/A'}</Typography>
        <Typography>Date: {new Date(estimate.date).toLocaleDateString()}</Typography>
      </Paper>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6">Materials</Typography>
              <Divider sx={{ mb: 1 }} />
              {estimate.materials?.length > 0 ? (
                estimate.materials.map((mat, index) => (
                  <Typography key={index}>
                    {mat.item} – {mat.quantity} × ₹{mat.rate} = ₹{mat.quantity * mat.rate}
                  </Typography>
                ))
              ) : (
                <Typography>No materials listed.</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6">Labor</Typography>
              <Divider sx={{ mb: 1 }} />
              {estimate.labor?.length > 0 ? (
                estimate.labor.map((lab, index) => (
                  <Typography key={index}>
                    {lab.item || lab.role} – {lab.quantity || lab.days} × ₹{lab.rate || lab.dailyRate} = ₹
                    {(lab.quantity || lab.days) * (lab.rate || lab.dailyRate)}
                  </Typography>
                ))
              ) : (
                <Typography>No labor listed.</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card variant="outlined" sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6">Summary</Typography>
          <Divider sx={{ mb: 1 }} />
          <Typography>Subtotal: ₹{estimate.totalCost - (estimate.tax || 0)}</Typography>
          <Typography>Tax (10%): ₹{estimate.tax || (estimate.totalCost * 0.1).toFixed(2)}</Typography>
          <Typography variant="h6" color="primary">Total: ₹{estimate.totalCost}</Typography>
        </CardContent>
      </Card>

      <Box mt={3} display="flex" gap={2}>
        <Button variant="outlined" color="secondary" onClick={() => navigate(-1)}>
          Back
        </Button>
        <Button variant="contained" color="primary" onClick={() => navigate(`/estimate/${id}/edit`)}>
          Edit Estimate
        </Button>
        <Button variant="contained" color="success" onClick={handleDownloadPDF}>
          Export PDF
        </Button>
      </Box>
    </Box>
  );
};

export default EstimateDetails;
