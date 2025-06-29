// EstimateEditor.jsx
import React, { useState } from 'react';
import { Box, Tabs, Tab, Typography, Divider } from '@mui/material';
import EditEstimate from '../components/EditEstimate';
import PDFCustomization from '../components/PDFCustomization';
import PDFPreview from '../components/PDFPreview';
import ExportShare from '../components/ExportShare';
import Navbar from '../components/Navbar'

const EstimateEditor = ({ estimateData }) => {
  const [tab, setTab] = useState(0);

  const handleChange = (event, newValue) => setTab(newValue);

  return (
    <>
    <Navbar/>
  
    <Box p={4}>
      
    <Tabs
        value={tab}
        onChange={handleChange}
        centered
        sx={{ mb: 3 }}
      >
        <Tab label="Edit Estimate" sx={{ color: 'white',fontWeight:'bold' }} />
        <Tab label="PDF Customization" sx={{ color: 'white',fontWeight:'bold' }} />
        <Tab label="Preview PDF" sx={{ color: 'white',fontWeight:'bold' }} />
        <Tab label="Export & Share" sx={{ color: 'white',fontWeight:'bold' }} />
      </Tabs>


      <Divider sx={{ mb: 3 }} />

      {tab === 0 && <EditEstimate estimate={estimateData} />}
      {tab === 1 && <PDFCustomization />}
      {tab === 2 && <PDFPreview estimate={estimateData} />}
      {tab === 3 && <ExportShare estimate={estimateData} />}
    </Box>
    </>
  );
};

export default EstimateEditor;
