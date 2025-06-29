// // EstimateEditor.jsx
// import React, { useState } from 'react';
// import { Box, Tabs, Tab, Typography, Divider } from '@mui/material';
// import EditEstimate from '../components/EditEstimate';
// import PDFCustomization from '../components/PDFCustomization';
// import PDFPreview from '../components/PDFPreview';
// import ExportShare from '../components/ExportShare';
// import Navbar from '../components/Navbar'


// const EstimateEditor = ({ estimateData }) => {
//   const [tab, setTab] = useState(0);

//   const handleChange = (event, newValue) => setTab(newValue);

//   return (
//     <>
//     <Navbar/>
  
//     <Box p={4}>
      
//     <Tabs
//         value={tab}
//         onChange={handleChange}
//         centered
//         sx={{ mb: 3 }}
//       >
//         <Tab label="Edit Estimate" sx={{ color: 'white',fontWeight:'bold' }} />
//         <Tab label="PDF Customization" sx={{ color: 'white',fontWeight:'bold' }} />
//         <Tab label="Preview PDF" sx={{ color: 'white',fontWeight:'bold' }} />
//         <Tab label="Export & Share" sx={{ color: 'white',fontWeight:'bold' }} />
//       </Tabs>


//       <Divider sx={{ mb: 3 }} />

//       {tab === 0 && <EditEstimate estimate={estimateData} />}
//       {tab === 1 && <PDFCustomization />}
//       {tab === 2 && <PDFPreview estimate={estimateData} />}
//       {tab === 3 && <ExportShare estimate={estimateData} />}
//     </Box>
//     </>
//   );
// };

// export default EstimateEditor;

// EstimateEditor.jsx


import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Divider,
  CircularProgress,
} from '@mui/material';

import EditEstimate from '../components/EditEstimate';
import PDFCustomization from '../components/PDFCustomization';
import PDFPreview from '../components/PDFPreview';
import ExportShare from '../components/ExportShare';
import Navbar from '../components/Navbar';
import BASE_URL from '../services/api';

const EstimateEditor = () => {
  const { id } = useParams(); // Get estimate ID from route
  const [tab, setTab] = useState(0);
  const [estimateData, setEstimateData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Handle tab switch
  const handleChange = (event, newValue) => setTab(newValue);

  // Fetch estimate by ID
  useEffect(() => {
    const fetchEstimate = async () => {
      try {
        const res = await fetch(`${BASE_URL}/estimates/${id}`);
        const data = await res.json();
        setEstimateData(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch estimate:', error);
        setLoading(false);
      }
    };

    fetchEstimate();
  }, [id]);

  return (
    <>
      <Navbar />

      <Box p={4}>
        <Tabs value={tab} onChange={handleChange} centered sx={{ mb: 3 }}>
          <Tab label="Edit Estimate" sx={{ color: 'white', fontWeight: 'bold' }} />
          <Tab label="PDF Customization" sx={{ color: 'white', fontWeight: 'bold' }} />
          <Tab label="Preview PDF" sx={{ color: 'white', fontWeight: 'bold' }} />
          <Tab label="Export & Share" sx={{ color: 'white', fontWeight: 'bold' }} />
        </Tabs>

        <Divider sx={{ mb: 3, borderColor: 'white' }} />

        {loading ? (
          <Box textAlign="center" mt={5}>
            <CircularProgress color="inherit" />
            <Typography color="white" mt={2}>
              Loading estimate...
            </Typography>
          </Box>
        ) : (
          <>
            {tab === 0 && <EditEstimate estimate={estimateData} />}
            {tab === 1 && <PDFCustomization estimate={estimateData} />}
            {tab === 2 && <PDFPreview estimate={estimateData} />}
            {tab === 3 && <ExportShare estimate={estimateData} />}
          </>
        )}
      </Box>
    </>
  );
};

export default EstimateEditor;
