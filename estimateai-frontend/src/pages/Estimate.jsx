import React, { useState, useRef, useContext } from 'react';
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  IconButton,
} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import jsPDF from 'jspdf';
import { AuthContext } from '../context/AuthContext';
import BASE_URL from '../services/api';


const Estimate = () => {
  const { user } = useContext(AuthContext);
  const [input, setInput] = useState('');
  const [estimate, setEstimate] = useState(null);
  const [isListening, setIsListening] = useState(false);

  const recognitionRef = useRef(null);

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

  const handleGenerateEstimate = async () => {
    const mockResponse = {
      materials: [
        { item: 'Bricks', quantity: 500, unitCost: 6 },
        { item: 'Cement Bags', quantity: 20, unitCost: 350 },
      ],
      labor: [
        { role: 'Mason', days: 2, dailyRate: 800 },
        { role: 'Helper', days: 2, dailyRate: 500 },
      ],
    };

    const totalCost =
      500 * 6 + 20 * 350 + 2 * 800 + 2 * 500;

    const fullEstimate = {
      input,
      materials: mockResponse.materials,
      labor: mockResponse.labor,
      totalCost,
    };

    setEstimate(fullEstimate);

    // Save to backend if logged in
    if (user?.token) {
      try {
        await fetch(`${BASE_URL}/estimates/save`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: user.token,
          },
          body: JSON.stringify(fullEstimate),
        });
      } catch (err) {
        console.error('Error saving estimate:', err);
        alert('Failed to save estimate to backend');
      }
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text('Estimate Report', 10, 10);
    doc.text(`Project: ${input}`, 10, 20);

    let y = 30;
    doc.text('Materials:', 10, y);
    y += 10;
    estimate.materials.forEach((mat) => {
      doc.text(
        `${mat.item} - Qty: ${mat.quantity}, Unit: ₹${mat.unitCost}`,
        10,
        y
      );
      y += 10;
    });

    doc.text('Labor:', 10, y);
    y += 10;
    estimate.labor.forEach((lab) => {
      doc.text(
        `${lab.role} - Days: ${lab.days}, Rate: ₹${lab.dailyRate}`,
        10,
        y
      );
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

      <Button
        variant="contained"
        color="primary"
        onClick={handleGenerateEstimate}
      >
        Generate Estimate
      </Button>

      {estimate && (
        <Card style={{ marginTop: '20px', padding: '15px' }}>
          <CardContent>
            <Typography variant="h6">Estimate Result</Typography>

            <Typography
              variant="subtitle1"
              style={{ marginTop: '10px' }}
            >
              Materials:
            </Typography>
            {estimate.materials.map((mat, index) => (
              <Typography key={index}>
                {mat.item}: {mat.quantity} × ₹{mat.unitCost} = ₹
                {mat.quantity * mat.unitCost}
              </Typography>
            ))}

            <Typography
              variant="subtitle1"
              style={{ marginTop: '10px' }}
            >
              Labor:
            </Typography>
            {estimate.labor.map((lab, index) => (
              <Typography key={index}>
                {lab.role}: {lab.days} × ₹{lab.dailyRate} = ₹
                {lab.days * lab.dailyRate}
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



// import {
//   Grid,
//   Paper,
//   Divider,
//   TextField,
//   Button,
//   Card,
//   CardContent,
//   Typography,
//   IconButton,
// } from '@mui/material';
// import MicIcon from '@mui/icons-material/Mic';
// import jsPDF from 'jspdf';
// import { useContext, useRef, useState } from 'react';
// import { AuthContext } from '../context/AuthContext';
// import BASE_URL from '../services/api';

// const Estimate = () => {
//   const { user } = useContext(AuthContext);
//   const [input, setInput] = useState('');
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
//         setInput((prev) => prev + ' ' + transcript);
//         setIsListening(false);
//       };

//       recognitionRef.current.onerror = (err) => {
//         console.error('Speech error:', err);
//         setIsListening(false);
//       };

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
//       input,
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
//         console.error('Error saving estimate:', err);
//         alert('Failed to save estimate to backend');
//       }
//     }
//   };

//   const handleDownloadPDF = () => {
//     const doc = new jsPDF();
//     doc.text('Estimate Report', 10, 10);
//     doc.text(`Project: ${input}`, 10, 20);

//     let y = 30;
//     doc.text('Materials:', 10, y);
//     y += 10;
//     estimate.materials.forEach((mat) => {
//       doc.text(
//         `${mat.item} - Qty: ${mat.quantity}, Unit: ₹${mat.unitCost}`,
//         10,
//         y
//       );
//       y += 10;
//     });

//     doc.text('Labor:', 10, y);
//     y += 10;
//     estimate.labor.forEach((lab) => {
//       doc.text(
//         `${lab.role} - Days: ${lab.days}, Rate: ₹${lab.dailyRate}`,
//         10,
//         y
//       );
//       y += 10;
//     });

//     doc.text(`Total Estimate: ₹${estimate.totalCost}`, 10, y + 10);
//     doc.save('EstimateAI_Report.pdf');
//   };

//   return (
//     <Grid container spacing={3}>
//       {/* Input Section */}
//       <Grid item xs={12}>
//         <Paper elevation={3} style={{ padding: 20 }}>
//           <Typography variant="h5" gutterBottom>
//             Describe Your Project
//           </Typography>
//           <Grid container spacing={2} alignItems="flex-start">
//             <Grid item xs={11}>
//               <TextField
//                 label="Project Description"
//                 fullWidth
//                 multiline
//                 rows={4}
//                 variant="outlined"
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//               />
//             </Grid>
//             <Grid item xs={1}>
//               <IconButton
//                 color={isListening ? 'secondary' : 'primary'}
//                 onClick={handleVoiceInput}
//               >
//                 <MicIcon />
//               </IconButton>
//             </Grid>
//           </Grid>
//           <Button
//             variant="contained"
//             color="primary"
//             onClick={handleGenerateEstimate}
//             style={{ marginTop: 20 }}
//           >
//             Generate Estimate
//           </Button>
//         </Paper>
//       </Grid>

//       {/* Result Section */}
//       {estimate && (
//         <Grid item xs={12}>
//           <Card>
//             <CardContent>
//               <Typography variant="h6" gutterBottom>
//                 Estimate Summary
//               </Typography>

//               <Divider style={{ marginBottom: 10 }} />
//               <Typography variant="subtitle1" gutterBottom>
//                 Materials:
//               </Typography>
//               {estimate.materials.map((mat, idx) => (
//                 <Typography key={idx} variant="body1">
//                   {mat.item}: {mat.quantity} × ₹{mat.unitCost} = ₹
//                   {mat.quantity * mat.unitCost}
//                 </Typography>
//               ))}

//               <Divider style={{ margin: '20px 0' }} />
//               <Typography variant="subtitle1" gutterBottom>
//                 Labor:
//               </Typography>
//               {estimate.labor.map((lab, idx) => (
//                 <Typography key={idx} variant="body1">
//                   {lab.role}: {lab.days} × ₹{lab.dailyRate} = ₹
//                   {lab.days * lab.dailyRate}
//                 </Typography>
//               ))}

//               <Divider style={{ margin: '20px 0' }} />
//               <Typography variant="h6" color="primary">
//                 Total Estimate: ₹{estimate.totalCost}
//               </Typography>

//               <Button
//                 variant="outlined"
//                 color="secondary"
//                 style={{ marginTop: 15 }}
//                 onClick={handleDownloadPDF}
//               >
//                 Download PDF
//               </Button>
//             </CardContent>
//           </Card>
//         </Grid>
//       )}
//     </Grid>
//   );
// };

// export default Estimate;
