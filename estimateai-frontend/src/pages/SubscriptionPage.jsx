// import React from 'react';
// import Navbar from '../components/Navbar'
// import {
//   Box,
//   Typography,
//   Paper,
//   Grid,
//   Button,
//   Card,
//   CardContent,
// } from '@mui/material';

// const plans = [
//   {
//     name: 'Basic',
//     price: '₹199/month',
//     description: 'Perfect for individuals starting out.',
//     features: ['5 Estimates/month', 'Basic Support', 'Access to templates'],
//     color: '#e0f7fa',
//   },
//   {
//     name: 'Pro',
//     price: '₹499/month',
//     description: 'For growing teams and businesses.',
//     features: ['Unlimited Estimates', 'Priority Support', 'AI Enhancements'],
//     color: '#fff3e0',
//   },
//   {
//     name: 'Enterprise',
//     price: 'Custom',
//     description: 'Tailored solutions for large organizations.',
//     features: ['Custom features', 'Dedicated support', 'Team access'],
//     color: '#ede7f6',
//   },
// ];

// const SubscriptionPage = () => {
//   return (
//     <>
//     <Navbar/>
//     <Box sx={{ p: 4, maxWidth: 1200, mx: 'auto' }}>

//       <Typography variant="h4" fontWeight="bold" gutterBottom align="center" color='white'>
//         Choose a Subscription Plan
//       </Typography>
//       <Typography variant="subtitle1" color="textSecondary" align="center" mb={4} sx={{color:'white'}}>
//         Upgrade to unlock more features and AI-powered tools
//       </Typography>

//       <Grid container spacing={3} justifyContent={'center'}>
//         {plans.map((plan, idx) => (
//           <Grid item xs={12} md={4} key={idx}>
//             <Card sx={{ backgroundColor: plan.color }}>
//               <CardContent>
//                 <Typography variant="h5" fontWeight="bold" gutterBottom>
//                   {plan.name}
//                 </Typography>
//                 <Typography variant="h6" color="primary" gutterBottom>
//                   {plan.price}
//                 </Typography>
//                 <Typography variant="body2" mb={2}>
//                   {plan.description}
//                 </Typography>
//                 <ul style={{ paddingLeft: 20 }}>
//                   {plan.features.map((feature, i) => (
//                     <li key={i}>
//                       <Typography variant="body2">{feature}</Typography>
//                     </li>
//                   ))}
//                 </ul>
//                 <Button
//                   fullWidth
//                   variant="contained"
//                   color="primary"
//                   sx={{ mt: 2 }}
//                   disabled={plan.name === 'Enterprise'} // For now
//                 >
//                   {plan.name === 'Enterprise' ? 'Contact Us' : 'Subscribe'}
//                 </Button>
//               </CardContent>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>
//     </Box>
//     </>
//   );
// };

// export default SubscriptionPage;


import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import {
  Box,
  Typography,
  Grid,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
} from '@mui/material';
import QRCode from 'react-qr-code';



const plans = [
  {
    name: 'Basic',
    price: '₹199/month',
    description: 'Perfect for individuals starting out.',
    features: ['5 Estimates/month', 'Basic Support', 'Access to templates'],
    color: '#e0f7fa',
  },
  {
    name: 'Pro',
    price: '₹499/month',
    description: 'For growing teams and businesses.',
    features: ['Unlimited Estimates', 'Priority Support', 'AI Enhancements'],
    color: '#fff3e0',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'Tailored solutions for large organizations.',
    features: ['Custom features', 'Dedicated support', 'Team access'],
    color: '#ede7f6',
  },
];

const SubscriptionPage = () => {
  const [openQR, setOpenQR] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubscribeClick = (plan) => {
    setSelectedPlan(plan);
    setOpenQR(true);
  };



  return (
    <>
      <Navbar />
      <Box sx={{ p: 4, maxWidth: 1200, mx: 'auto' }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom align="center" color="white">
          Choose a Subscription Plan
        </Typography>
        <Typography variant="subtitle1" align="center" mb={4} sx={{ color: 'white' }}>
          Upgrade to unlock more features and AI-powered tools
        </Typography>

        <Grid container spacing={3} justifyContent={'center'}>
          {plans.map((plan, idx) => (
            <Grid item xs={12} md={4} key={idx}>
              <Card sx={{ backgroundColor: plan.color }}>
                <CardContent>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    {plan.name}
                  </Typography>
                  <Typography variant="h6" color="primary" gutterBottom>
                    {plan.price}
                  </Typography>
                  <Typography variant="body2" mb={2}>
                    {plan.description}
                  </Typography>
                  <ul style={{ paddingLeft: 20 }}>
                    {plan.features.map((feature, i) => (
                      <li key={i}>
                        <Typography variant="body2">{feature}</Typography>
                      </li>
                    ))}
                  </ul>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2 }}
                    disabled={plan.name === 'Enterprise'}
                    onClick={() => handleSubscribeClick(plan)}
                  >
                    {plan.name === 'Enterprise' ? 'Contact Us' : 'Subscribe'}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* QR Code Dialog */}
      <Dialog open={openQR} onClose={() => setOpenQR(false)}>
        <DialogTitle>Scan to Pay</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 2 }}>
        <QRCode
            value={`https://pay.example.com/${selectedPlan?.name.toLowerCase()}`}
            style={{ height: '200px', width: '200px' }}
          />

          <Typography mt={2}>
            Plan: <strong>{selectedPlan?.name}</strong>
          </Typography>
        </DialogContent>
      
      </Dialog>

      {/* Subscription Success Snackbar */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSuccess(false)}
        message="🎉 Subscription successful!"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </>
  );
};

export default SubscriptionPage;
