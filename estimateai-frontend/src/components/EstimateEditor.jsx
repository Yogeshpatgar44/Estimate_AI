// EstimateEditor.jsx
import React, { useState } from 'react';
import { Box, Tabs, Tab, Typography, Divider } from '@mui/material';
// import EditEstimate from './EditEstimate';
// import PDFCustomization from './PDFCustomization';
// import PDFPreview from './PDFPreview';
// import ExportShare from './ExportShare';

const EstimateEditor = ({ estimateData }) => {
  const [tab, setTab] = useState(0);

  const handleChange = (event, newValue) => setTab(newValue);

  return (
    <Box p={4}>
      <Tabs value={tab} onChange={handleChange} centered sx={{ mb: 3 }}>
        <Tab label="Edit Estimate" />
        <Tab label="PDF Customization" />
        <Tab label="Preview PDF" />
        <Tab label="Export & Share" />
      </Tabs>

      <Divider sx={{ mb: 3 }} />

      {tab === 0 && <EditEstimate estimate={estimateData} />}
      {tab === 1 && <PDFCustomization />}
      {tab === 2 && <PDFPreview estimate={estimateData} />}
      {tab === 3 && <ExportShare estimate={estimateData} />}
    </Box>
  );
};

export default EstimateEditor;
