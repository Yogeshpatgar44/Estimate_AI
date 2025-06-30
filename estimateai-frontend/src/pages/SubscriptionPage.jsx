import React from 'react';
import Navbar from '../components/Navbar'
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Card,
  CardContent,
} from '@mui/material';

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
  return (
    <>
    <Navbar/>
    <Box sx={{ p: 4, maxWidth: 1200, mx: 'auto' }}>

      <Typography variant="h4" fontWeight="bold" gutterBottom align="center">
        Choose a Subscription Plan
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" align="center" mb={4}>
        Upgrade to unlock more features and AI-powered tools
      </Typography>

      <Grid container spacing={3}>
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
                  disabled={plan.name === 'Enterprise'} // For now
                >
                  {plan.name === 'Enterprise' ? 'Contact Us' : 'Subscribe'}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
    </>
  );
};

export default SubscriptionPage;
