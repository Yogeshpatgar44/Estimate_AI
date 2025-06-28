import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // ⬅️ import useNavigate
import { AuthContext } from '../context/AuthContext';
import { useSnackbar } from 'notistack';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
} from '@mui/material';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate(); // ⬅️ initialize navigate

  const handleLogout = () => {
    logout();
    enqueueSnackbar('Logged out successfully', { variant: 'info' });
    navigate('/login'); // ⬅️ redirect after logout
  };

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          EstimateAI
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {user && (
            <>
              <Button color="inherit" component={Link} to="/">Home</Button>
              <Button color="inherit" component={Link} to="/estimate">Estimate</Button>
              <Button color="inherit" component={Link} to="/history">History</Button>
            </>
          )}
          {!user ? (
            <Button color="inherit" component={Link} to="/login">Login</Button>
          ) : (
            <Button color="inherit" onClick={handleLogout}>Logout</Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
