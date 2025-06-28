// import React, { useState, useRef, useContext } from 'react';
// import {
//   Typography,
//   TextField,
//   Button,
//   Card,
//   CardContent,
//   IconButton,
//   Grid,
//   Paper,
//   Box,
// } from '@mui/material';
// import MicIcon from '@mui/icons-material/Mic';
// import jsPDF from 'jspdf';
// import { AuthContext } from '../context/AuthContext';
// import BASE_URL from '../services/api';

// const Estimate = () => {
//   const { user } = useContext(AuthContext);
//   const [title, setTitle] = useState('');
//   const [clientName, setClientName] = useState('');
//   const [clientEmail, setClientEmail] = useState('');
//   const [description, setDescription] = useState('');
//   const [estimate, setEstimate] = useState(null);
//   const [isListening, setIsListening] = useState(false);
//   const recognitionRef = useRef(null);

//   const SpeechRecognition =
//     window.SpeechRecognition || window.webkitSpeechRecognition;

//   const handleVoiceInput = () => {
//     if (!SpeechRecognition) {
//       alert('Speech recognition not supported in this browser.');
//       return;
//     }

//     if (!recognitionRef.current) {
//       recognitionRef.current = new SpeechRecognition();
//       recognitionRef.current.continuous = false;
//       recognitionRef.current.lang = 'en-US';

//       recognitionRef.current.onresult = (event) => {
//         const transcript = event.results[0][0].transcript;
//         setDescription((prev) => prev + ' ' + transcript);
//         setIsListening(false);
//       };

//       recognitionRef.current.onerror = () => setIsListening(false);
//       recognitionRef.current.onend = () => setIsListening(false);
//     }

//     if (!isListening) {
//       recognitionRef.current.start();
//       setIsListening(true);
//     } else {
//       recognitionRef.current.stop();
//       setIsListening(false);
//     }
//   };

//   const handleGenerateEstimate = async () => {
//     const mockResponse = {
//       materials: [
//         { item: 'Bricks', quantity: 500, unitCost: 6 },
//         { item: 'Cement Bags', quantity: 20, unitCost: 350 },
//       ],
//       labor: [
//         { role: 'Mason', days: 2, dailyRate: 800 },
//         { role: 'Helper', days: 2, dailyRate: 500 },
//       ],
//     };

//     const totalCost =
//       500 * 6 + 20 * 350 + 2 * 800 + 2 * 500;

//     const fullEstimate = {
//       title,
//       clientName,
//       clientEmail,
//       input: description,
//       materials: mockResponse.materials,
//       labor: mockResponse.labor,
//       totalCost,
//     };

//     setEstimate(fullEstimate);

//     if (user?.token) {
//       try {
//         await fetch(`${BASE_URL}/estimates/save`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: user.token,
//           },
//           body: JSON.stringify(fullEstimate),
//         });
//       } catch (err) {
//         console.error('Save error:', err);
//         alert('Failed to save estimate');
//       }
//     }
//   };

//   const handleDownloadPDF = () => {
//     const doc = new jsPDF();
//     doc.text('Estimate Report', 10, 10);
//     doc.text(`Title: ${title}`, 10, 20);
//     doc.text(`Client: ${clientName} (${clientEmail})`, 10, 30);
//     doc.text(`Description: ${description}`, 10, 40);

//     let y = 50;
//     doc.text('Materials:', 10, y);
//     y += 10;
//     estimate.materials.forEach((mat) => {
//       doc.text(`${mat.item} - Qty: ${mat.quantity}, Unit: ₹${mat.unitCost}`, 10, y);
//       y += 10;
//     });

//     doc.text('Labor:', 10, y);
//     y += 10;
//     estimate.labor.forEach((lab) => {
//       doc.text(`${lab.role} - Days: ${lab.days}, Rate: ₹${lab.dailyRate}`, 10, y);
//       y += 10;
//     });

//     doc.text(`Total Estimate: ₹${estimate.totalCost}`, 10, y + 10);
//     doc.save('EstimateAI_Report.pdf');
//   };

//   return (
//     <Box p={3}>
//       <Typography variant="h4" gutterBottom>
//         Create AI Estimate
//       </Typography>
//       <Typography variant="subtitle1" color="textSecondary" gutterBottom>
//         Describe your construction project and let AI generate a professional estimate
//       </Typography>

//       <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
//         <Typography variant="h6" gutterBottom>
//           AI Construction Estimate Generator
//         </Typography>

//         <Grid container spacing={2}>
//           <Grid item xs={12}>
//             <TextField
//               label="Estimate Title"
//               placeholder="e.g., Kitchen Renovation Project"
//               fullWidth
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//             />
//           </Grid>

//           <Grid item xs={12} sm={6}>
//             <TextField
//               label="Client Name"
//               fullWidth
//               value={clientName}
//               onChange={(e) => setClientName(e.target.value)}
//             />
//           </Grid>

//           <Grid item xs={12} sm={6}>
//             <TextField
//               label="Client Email"
//               type="email"
//               fullWidth
//               value={clientEmail}
//               onChange={(e) => setClientEmail(e.target.value)}
//             />
//           </Grid>

//           <Grid item xs={12}>
//             <Box display="flex" alignItems="flex-start">
//               <TextField
//                 label="Construction Project Description"
//                 placeholder="Include project type, materials, labor, permits, site conditions, etc."
//                 fullWidth
//                 multiline
//                 rows={5}
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//               />
//               <IconButton
//                 color={isListening ? 'secondary' : 'primary'}
//                 onClick={handleVoiceInput}
//                 sx={{ mt: 1, ml: 1 }}
//               >
//                 <MicIcon />
//               </IconButton>
//             </Box>
//           </Grid>

//           <Grid item xs={12}>
//             <Button variant="contained" color="primary" onClick={handleGenerateEstimate}>
//               Generate AI Construction Estimate
//             </Button>
//           </Grid>
//         </Grid>
//       </Paper>

//       {estimate && (
//         <Card sx={{ mt: 4 }}>
//           <CardContent>
//             <Typography variant="h6">Estimate Summary</Typography>

//             <Typography variant="subtitle2" sx={{ mt: 2 }}>Materials:</Typography>
//             {estimate.materials.map((mat, i) => (
//               <Typography key={i}>
//                 {mat.item}: {mat.quantity} × ₹{mat.unitCost} = ₹{mat.quantity * mat.unitCost}
//               </Typography>
//             ))}

//             <Typography variant="subtitle2" sx={{ mt: 2 }}>Labor:</Typography>
//             {estimate.labor.map((lab, i) => (
//               <Typography key={i}>
//                 {lab.role}: {lab.days} × ₹{lab.dailyRate} = ₹{lab.days * lab.dailyRate}
//               </Typography>
//             ))}

//             <Typography variant="h6" sx={{ mt: 2 }}>
//               Total Estimate: ₹{estimate.totalCost}
//             </Typography>

//             <Button
//               variant="outlined"
//               color="secondary"
//               sx={{ mt: 2 }}
//               onClick={handleDownloadPDF}
//             >
//               Download PDF
//             </Button>
//           </CardContent>
//         </Card>
//       )}
//     </Box>
//   );
// };

// export default Estimate;

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
import jsPDF from 'jspdf';
import { AuthContext } from '../context/AuthContext';
import BASE_URL from '../services/api';

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

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

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
        setEstimate(data);
    
        // Save to history
        await fetch(`${BASE_URL}/estimates/save`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: user.token
          },
          body: JSON.stringify({ title, clientName, clientEmail, input: description, ...data })
        });
      } catch (e) {
        console.error(e);
        alert('AI failed');
      } finally {
        setLoading(false);
      }
    };
    

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text('Estimate Report', 10, 10);
    doc.text(`Title: ${title}`, 10, 20);
    doc.text(`Client: ${clientName} (${clientEmail})`, 10, 30);
    doc.text(`Description: ${description}`, 10, 40);

    let y = 50;
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
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Create AI Estimate
      </Typography>
      <Typography variant="subtitle1" color="textSecondary">
        Provide details about your construction project and our AI will generate a professional estimate.
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
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

          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleGenerateEstimate}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Generate Estimate'}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {estimate && (
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant="h6">Estimate Summary</Typography>

            <Typography variant="subtitle2" sx={{ mt: 2 }}>Materials:</Typography>
            {estimate.materials.map((mat, i) => (
              <Typography key={i}>
                {mat.item}: {mat.quantity} × ₹{mat.unitCost} = ₹{mat.quantity * mat.unitCost}
              </Typography>
            ))}

            <Typography variant="subtitle2" sx={{ mt: 2 }}>Labor:</Typography>
            {estimate.labor.map((lab, i) => (
              <Typography key={i}>
                {lab.role}: {lab.days} × ₹{lab.dailyRate} = ₹{lab.days * lab.dailyRate}
              </Typography>
            ))}

            <Typography variant="h6" sx={{ mt: 2 }}>
              Total Estimate: ₹{estimate.totalCost}
            </Typography>

            <Button
              variant="outlined"
              color="secondary"
              sx={{ mt: 2 }}
              onClick={handleDownloadPDF}
            >
              Download PDF
            </Button>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default Estimate;
