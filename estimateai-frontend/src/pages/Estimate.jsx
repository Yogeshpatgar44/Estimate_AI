import React, { useState, useRef } from 'react';
import { TextField, Button, Card, CardContent, Typography, IconButton } from '@mui/material';
import MicIcon from "@mui/icons-material/Mic";
import jsPDF from 'jspdf';

const Estimate = () => {
  const [input, setInput] = useState('');
  const [estimate, setEstimate] = useState(null);
  const [isListening, setIsListening] = useState(false);

  const recognitionRef = useRef(null);

  // Check browser support
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  const handleVoiceInput = () => {
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput((prev) => prev + ' ' + transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (err) => {
        console.error('Speech recognition error:', err);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    if (!isListening) {
      recognitionRef.current.start();
      setIsListening(true);
    } else {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleGenerateEstimate = () => {
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

  

    const savedUser = JSON.parse(localStorage.getItem('estimate_user'));
    if (savedUser) {
    const history = JSON.parse(localStorage.getItem('estimate_history')) || {};
    const userHistory = history[savedUser.username] || [];
    userHistory.push({ input, ...mockResponse, date: new Date().toLocaleString() });
    history[savedUser.username] = userHistory;
    localStorage.setItem('estimate_history', JSON.stringify(history));
  }


  };

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        AI Estimation Tool
      </Typography>

      <div style={{ display: 'flex', alignItems: 'center' }}>
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
        <IconButton
          color={isListening ? 'secondary' : 'primary'}
          onClick={handleVoiceInput}
          style={{ marginLeft: '10px', height: '40px' }}
        >
          <MicIcon />
        </IconButton>
      </div>

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
                {mat.item}: {mat.quantity} × ₹{mat.unitCost} = ₹{mat.quantity * mat.unitCost}
              </Typography>
            ))}

            <Typography variant="subtitle1" style={{ marginTop: '10px' }}>Labor:</Typography>
            {estimate.labor.map((lab, index) => (
              <Typography key={index}>
                {lab.role}: {lab.days} × ₹{lab.dailyRate} = ₹{lab.days * lab.dailyRate}
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
