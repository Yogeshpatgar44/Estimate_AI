import React, { useState } from 'react';
import { TextField, Button, Card, CardContent, Typography } from '@mui/material';
import jsPDF from 'jspdf';

const Estimate = () => {
  const [input, setInput] = useState('');
  const [estimate, setEstimate] = useState(null);

  const handleGenerateEstimate = () => {
    // Mocked AI response (Replace with backend API call later)
    const mockResponse = {
      materials: [
        { item: 'Bricks', quantity: 500, unitCost: 6 },
        { item: 'Cement Bags', quantity: 20, unitCost: 350 },
      ],
      labor: [
        { role: 'Mason', days: 2, dailyRate: 800 },
        { role: 'Helper', days: 2, dailyRate: 500 },
      ],
      totalCost: 500 * 6 + 20 * 350 + 2 * 800 + 2 * 500,
    };
    setEstimate(mockResponse);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text('Estimate Report', 10, 10);
    doc.text(`Project: ${input}`, 10, 20);

    let y = 30;
    doc.text('Materials:', 10, y);
    y += 10;
    estimate.materials.forEach((mat) => {
      doc.text(`${mat.item} - Qty: ${mat.quantity}, Unit: ₹${mat.unitCost}`, 10, y);
      y += 10;
    });

    doc.text('Labor:', 10, y);
    y += 10;
    estimate.labor.forEach((lab) => {
      doc.text(`${lab.role} - Days: ${lab.days}, Rate: ₹${lab.dailyRate}`, 10, y);
      y += 10;
    });

    doc.text(`Total Estimate: ₹${estimate.totalCost}`, 10, y + 10);
    doc.save('EstimateAI_Report.pdf');
  };

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        AI Estimation Tool
      </Typography>

      <TextField
        label="Describe your project"
        fullWidth
        multiline
        rows={4}
        variant="outlined"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ marginBottom: '20px' }}
      />

      <Button variant="contained" color="primary" onClick={handleGenerateEstimate}>
        Generate Estimate
      </Button>

      {estimate && (
        <Card style={{ marginTop: '20px', padding: '15px' }}>
          <CardContent>
            <Typography variant="h6">Estimate Result</Typography>

            <Typography variant="subtitle1" style={{ marginTop: '10px' }}>Materials:</Typography>
            {estimate.materials.map((mat, index) => (
              <Typography key={index}>
                {mat.item}: {mat.quantity} units × ₹{mat.unitCost} = ₹{mat.quantity * mat.unitCost}
              </Typography>
            ))}

            <Typography variant="subtitle1" style={{ marginTop: '10px' }}>Labor:</Typography>
            {estimate.labor.map((lab, index) => (
              <Typography key={index}>
                {lab.role}: {lab.days} days × ₹{lab.dailyRate} = ₹{lab.days * lab.dailyRate}
              </Typography>
            ))}

            <Typography variant="h6" style={{ marginTop: '15px' }}>
              Total Estimate: ₹{estimate.totalCost}
            </Typography>

            <Button
              variant="outlined"
              color="secondary"
              style={{ marginTop: '15px' }}
              onClick={handleDownloadPDF}
            >
              Download PDF
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Estimate;
