import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  Grid,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff, ArrowBack } from '@mui/icons-material';
import { AuthContext } from '../context/AuthContext';
import { useSnackbar } from 'notistack';

const Register = () => {
  const { register } = useContext(AuthContext);
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async () => {
    if (!username || !password || !confirm || !fullName) {
      enqueueSnackbar('All fields are required', { variant: 'warning' });
      return;
    }

    if (password !== confirm) {
      enqueueSnackbar('Passwords do not match', { variant: 'error' });
      return;
    }

    try {
      await register({fullName,username, password});
      enqueueSnackbar('Registered successfully!', { variant: 'success' });
      navigate('/');
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      enqueueSnackbar('Username already taken', { variant: 'error' });
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: 'url(https://www.azorobotics.com/images/Article_Images/ImageForArticle_520_16535679756556228.jpg)',
        backgroundPosition: 'bottom',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          borderRadius: 3,
          maxWidth: 450,
          width: '100%',
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255,255,255,0.95)',
        }}
      >

        {/* Header */}
        <Box textAlign="center" mb={2}>
                    <Box display="flex" justifyContent="center" alignItems="center" gap={2}>
                      <img
                        src="https://cdn-icons-png.flaticon.com/512/9980/9980293.png"
                        alt="EstimateAI Logo"
                        style={{ height: 60 }}
                      />
                      <Typography variant="h4" color="primary" sx={{ mt: '8px' }}>
                        EstimateAI
                      </Typography>
                    </Box>
                  </Box>
        <Typography variant="h6" gutterBottom>
          Create Account
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Get started with your free EstimateAI account
        </Typography>

        {/* Form */}
        <Box mt={2}>
          <TextField
            label="Full Name"
            placeholder="Enter your full name"
            variant="outlined"
            fullWidth
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            margin="normal"
          />
          <TextField
            label="Email Address"
            placeholder="Enter your email"
            variant="outlined"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            margin="normal"
          />
          <TextField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Create a password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Confirm Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Confirm your password"
            variant="outlined"
            fullWidth
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3 }}
            onClick={handleSubmit}
          >
            Create Account
          </Button>

          <Box mt={2} textAlign="center">
            <Typography variant="body2">
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#1976d2' }}>
                Login
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Register;
