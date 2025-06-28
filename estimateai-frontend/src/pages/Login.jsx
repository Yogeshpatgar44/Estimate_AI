import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { TextField, Button, Typography } from '@mui/material';

const Login = () => {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (username.trim()) {
      login(username);
      navigate('/estimate');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h5" gutterBottom>Login</Typography>
      <TextField
        label="Username"
        fullWidth
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ marginBottom: '20px' }}
      />
      <Button variant="contained" onClick={handleSubmit}>
        Login
      </Button>
    </div>
  );
};

export default Login;
