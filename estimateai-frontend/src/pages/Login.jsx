import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/Authcontext';
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
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useSnackbar } from 'notistack';

const Login = () => {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async () => {
    try {
      await login(username, password);
      enqueueSnackbar('Login successful!', { variant: 'success' });
      navigate('/');
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      enqueueSnackbar('Invalid username or password', { variant: 'error' });
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
          maxWidth: 400,
          width: '100%',
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255,255,255,0.9)',
        }}
      >
        {/* Logo */}
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

        {/* Title */}
        <Typography variant="h6" gutterBottom>
          Welcome Back
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Sign in to your account to continue
        </Typography>

        {/* Form */}
        <Box mt={3}>
          <TextField
            label="Email Address"
            placeholder="Enter your email"
            variant="outlined"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
            margin="normal"
          />
          <TextField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
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

          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3 }}
            onClick={handleSubmit}
          >
            Sign In
          </Button>

          <Box mt={2} textAlign="center">
            <Typography variant="body2">
              Don’t have an account?{' '}
              <Link to="/register" style={{ color: '#1976d2' }}>
                Register
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;
