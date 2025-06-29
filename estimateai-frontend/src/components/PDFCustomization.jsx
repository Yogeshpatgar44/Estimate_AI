import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Grid,
  Button,
  MenuItem,
  InputLabel,
  Select,
  FormControl,
  Divider,
} from '@mui/material';

const PDFCustomization = ({ estimate }) => {
  const [companyInfo, setCompanyInfo] = useState({
    name: 'Your Company Name',
    phone: '(555) 123-4567',
    address: '123 Business Street, City, State 12345',
    email: 'info@yourcompany.com',
    website: 'www.yourcompany.com',
    logo: null,
  });

  const [styling, setStyling] = useState({
    headerColor: '#2563eb',
    accentColor: '#f59e0b',
    fontFamily: 'Inter',
    fontSize: 'medium',
    orientation: 'portrait',
  });

  const [footer, setFooter] = useState({
    footerText: 'Thank you for choosing our services!',
    terms: 'Payment is due within 30 days. This estimate is valid for 30 days.',
  });

  const handleLogoUpload = (e) => {
    setCompanyInfo({ ...companyInfo, logo: e.target.files[0] });
  };

  return (
    <Box sx={{backgroundColor:'white', padding:4,borderRadius:1}}>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        PDF Customization
      </Typography>

      {/* Company Info Section */}
      <Box mt={3}>
        <Typography variant="h6" gutterBottom>
          Company Information
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Company Name"
              fullWidth
              value={companyInfo.name}
              onChange={(e) => setCompanyInfo({ ...companyInfo, name: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Phone Number"
              fullWidth
              value={companyInfo.phone}
              onChange={(e) => setCompanyInfo({ ...companyInfo, phone: e.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Company Address"
              fullWidth
              value={companyInfo.address}
              onChange={(e) => setCompanyInfo({ ...companyInfo, address: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Email"
              fullWidth
              value={companyInfo.email}
              onChange={(e) => setCompanyInfo({ ...companyInfo, email: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Website"
              fullWidth
              value={companyInfo.website}
              onChange={(e) => setCompanyInfo({ ...companyInfo, website: e.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <InputLabel>Company Logo</InputLabel>
            <input type="file" accept="image/*" onChange={handleLogoUpload} />
            {companyInfo.logo && (
              <Typography variant="caption" color="text.secondary">
                {companyInfo.logo.name}
              </Typography>
            )}
          </Grid>
        </Grid>
      </Box>

      {/* Styling Section */}
      <Box mt={5}>
        <Typography variant="h6" gutterBottom>
          Colors & Styling
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Header Color"
              type="color"
              fullWidth
              value={styling.headerColor}
              onChange={(e) => setStyling({ ...styling, headerColor: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Accent Color"
              type="color"
              fullWidth
              value={styling.accentColor}
              onChange={(e) => setStyling({ ...styling, accentColor: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Font Family</InputLabel>
              <Select
                value={styling.fontFamily}
                onChange={(e) => setStyling({ ...styling, fontFamily: e.target.value })}
              >
                <MenuItem value="Inter">Inter</MenuItem>
                <MenuItem value="Arial">Arial</MenuItem>
                <MenuItem value="Roboto">Roboto</MenuItem>
                <MenuItem value="Helvetica">Helvetica</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Font Size</InputLabel>
              <Select
                value={styling.fontSize}
                onChange={(e) => setStyling({ ...styling, fontSize: e.target.value })}
              >
                <MenuItem value="small">Small</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="large">Large</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Page Orientation</InputLabel>
              <Select
                value={styling.orientation}
                onChange={(e) => setStyling({ ...styling, orientation: e.target.value })}
              >
                <MenuItem value="portrait">Portrait</MenuItem>
                <MenuItem value="landscape">Landscape</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {/* Footer Section */}
      <Box mt={5}>
        <Typography variant="h6" gutterBottom>
          Footer & Terms
        </Typography>
        <TextField
          label="Footer Text"
          fullWidth
          value={footer.footerText}
          onChange={(e) => setFooter({ ...footer, footerText: e.target.value })}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Terms and Conditions"
          fullWidth
          multiline
          rows={4}
          value={footer.terms}
          onChange={(e) => setFooter({ ...footer, terms: e.target.value })}
        />
      </Box>

      {/* Save/Apply Section (Optional) */}
      <Divider sx={{ my: 4 }} />
      <Button variant="contained" color="primary">
        Save PDF Settings
      </Button>
    </Box>
  );
};

export default PDFCustomization;
