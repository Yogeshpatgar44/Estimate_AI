import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { TextField, Button, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';

const Register = () => {
  const { register } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async () => {
    try {
      await register(username, password);
      enqueueSnackbar('Registered successfully!', { variant: 'success' });
      navigate('/estimate');
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      enqueueSnackbar('Username already taken', { variant: 'error' });
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h5" gutterBottom>
        Register
      </Typography>

      <TextField
        label="Username"
        fullWidth
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ marginBottom: '10px' }}
      />
      <TextField
        label="Password"
        type="password"
        fullWidth
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ marginBottom: '20px' }}
      />

      <Button variant="contained" onClick={handleSubmit}>
        Register
      </Button>
    </div>
  );
};

export default Register;
