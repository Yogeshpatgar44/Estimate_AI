import React, { useState, useRef, useContext } from 'react';
import {
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  IconButton,
  Grid,
  Paper,
  Box,
  CircularProgress,
} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import { AuthContext } from '../context/AuthContext';
import BASE_URL from '../services/api';
import { useNavigate } from 'react-router-dom';

const Estimate = () => {
  const { user } = useContext(AuthContext);
  const [title, setTitle] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [description, setDescription] = useState('');
  const [estimate, setEstimate] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const recognitionRef = useRef(null);
  const navigate = useNavigate();

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  const handleVoiceInput = () => {
    if (!SpeechRecognition) {
      alert('Speech recognition not supported in this browser.');
      return;
    }

    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setDescription((prev) => prev + ' ' + transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onend = () => setIsListening(false);
    }

    if (!isListening) {
      recognitionRef.current.start();
      setIsListening(true);
    } else {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const validateInputs = () => {
    if (!title || !clientName || !clientEmail || !description) {
      alert('Please fill in all fields.');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(clientEmail)) {
      alert('Please enter a valid email address.');
      return false;
    }

    return true;
  };

  const handleGenerateEstimate = async () => {
    if (!validateInputs()) return;
    setLoading(true);
    setEstimate(null);

    try {
      const res = await fetch(`${BASE_URL}/estimates/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: user.token,
        },
        body: JSON.stringify({
          title,
          clientName,
          clientEmail,
          input: description,
        }),
      });

      const data = await res.json();

      // Directly use the AI-generated estimate
      const saveRes = await fetch(`${BASE_URL}/estimates/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: user.token,
        },
        body: JSON.stringify({
          title,
          clientName,
          clientEmail,
          input: description,
          ...data,
        }),
      });

      const savedData = await saveRes.json();
      setEstimate(savedData);
    } catch (e) {
      console.error(e);
      alert('❌ AI failed to generate estimate.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={4}>
      <Typography gutterBottom color="primary" sx={{ fontWeight: 'bold', fontSize: 40, textAlign: 'center' }}>
        Create AI Estimate
      </Typography>
      <Typography variant="subtitle1" gutterBottom color="white" sx={{ textAlign: 'center' }}>
        Describe your construction project and let AI generate a professional estimate
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
        <Typography variant="h4" gutterBottom color="primary" sx={{ fontWeight: 'bold', fontSize: 30 }}>
          AI Construction Estimate Generator
        </Typography>
        <Typography variant="subtitle1" gutterBottom color="black">
          Describe your construction project and let AI generate a professional estimate
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Estimate Title"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Kitchen Renovation Project"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Client Name"
              fullWidth
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Client Email"
              type="email"
              fullWidth
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <Box display="flex">
              <TextField
                label="Construction Project Description"
                placeholder="Include project type, materials, labor, permits, site conditions, etc."
                fullWidth
                multiline
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                sx={{
                  width: '900px',
                  maxWidth: '800px',
                }}
              />
              <IconButton
                color={isListening ? 'secondary' : 'primary'}
                onClick={handleVoiceInput}
                sx={{ mt: 1, ml: 1 }}
              >
                <MicIcon />
              </IconButton>
            </Box>
          </Grid>

          <Typography variant="subtitle1" color="black">
            Be specific about materials, labor, timeline, permits, and any special construction requirements
          </Typography>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleGenerateEstimate}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Generate AI Construction Estimate'}
          </Button>
        </Grid>
      </Paper>

      {estimate && (
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Estimate Summary</Typography>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => navigate(`/edit-estimate/${estimate._id}`)}
              >
                Edit Estimate
              </Button>
            </Box>

            <Typography variant="subtitle2" sx={{ mt: 2 }}>Materials:</Typography>
            {estimate?.materials?.map((mat, i) => (
              <Typography key={i}>
                {mat.item}: {mat.quantity} × ₹{mat.unitCost} = ₹{mat.quantity * mat.unitCost}
              </Typography>
            ))}

            <Typography variant="subtitle2" sx={{ mt: 2 }}>Labor:</Typography>
            {estimate?.labor?.map((lab, i) => (
              <Typography key={i}>
                {lab.item}: {lab.quantity} × ₹{lab.unitCost} = ₹{lab.quantity * lab.unitCost}
              </Typography>
            ))}

            <Typography variant="subtitle2" sx={{ mt: 2 }}>Equipment:</Typography>
            {estimate?.equipment?.map((eq, i) => (
              <Typography key={i}>
                {eq.item}: {eq.quantity} × ₹{eq.unitCost} = ₹{eq.quantity * eq.unitCost}
              </Typography>
            ))}

            <Typography variant="h6" sx={{ mt: 2 }}>
              Total Estimate: ₹{estimate.totalCost}
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default Estimate;

