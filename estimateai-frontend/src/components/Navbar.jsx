import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // ⬅️ import useNavigate
import { AuthContext } from '../context/Authcontext';
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
    <AppBar position="sticky" color="primary" sx={{ top: 0, zIndex: 1100 }}>
      <Toolbar>
      <Box display="flex" alignItems="center" sx={{ flexGrow: 1 }}>
      <img
        src="https://cdn-icons-png.flaticon.com/512/9980/9980293.png"
        alt="EstimateAI Logo"
        style={{ height: 40, marginRight: 10 }}
      />
      <Typography variant="h6" component="div">
        EstimateAI
      </Typography>
    </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          {user && (
            <>
              <Button color="inherit" component={Link} to="/">Home</Button>
              <Button color="inherit" component={Link} to="/estimate">Estimate</Button>
              <Button color="inherit" component={Link} to="/history">History</Button>
              <Button color="inherit" component={Link} to="/subscribe">subcription</Button>
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
