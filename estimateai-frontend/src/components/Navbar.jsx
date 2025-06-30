// import React, { useContext } from 'react';
// import { Link, useNavigate } from 'react-router-dom'; // ⬅️ import useNavigate
// import { AuthContext } from '../context/AuthContext';
// import { useSnackbar } from 'notistack';
// import {
//   AppBar,
//   Toolbar,
//   Typography,
//   Button,
//   Box,
// } from '@mui/material';

// const Navbar = () => {
//   const { user, logout } = useContext(AuthContext);
//   const { enqueueSnackbar } = useSnackbar();
//   const navigate = useNavigate(); // ⬅️ initialize navigate

//   const handleLogout = () => {
//     logout();
//     enqueueSnackbar('Logged out successfully', { variant: 'info' });
//     navigate('/login'); // ⬅️ redirect after logout
//   };

//   return (
//     <AppBar position="sticky" color="primary" sx={{ top: 0, zIndex: 1100 }}>
//       <Toolbar>
//       <Box display="flex" alignItems="center" sx={{ flexGrow: 1 }}>
//       <img
//         src="https://cdn-icons-png.flaticon.com/512/9980/9980293.png"
//         alt="EstimateAI Logo"
//         style={{ height: 40, marginRight: 10 }}
//       />
//       <Typography variant="h6" component="div">
//         EstimateAI
//       </Typography>
//     </Box>

//         <Box sx={{ display: 'flex', gap: 2 }}>
//           {user && (
//             <>
//               <Button color="inherit" component={Link} to="/">Home</Button>
//               <Button color="inherit" component={Link} to="/estimate">Estimate</Button>
//               <Button color="inherit" component={Link} to="/history">History</Button>
//               <Button color="inherit" component={Link} to="/subscribe">subcription</Button>
//             </>
//           )}
//           {!user ? (
//             <Button color="inherit" component={Link} to="/login">Login</Button>
//           ) : (
//             <Button color="inherit" onClick={handleLogout}>Logout</Button>
//           )}
//         </Box>
//       </Toolbar>
//     </AppBar>
//   );
// };

// export default Navbar;

import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useSnackbar } from 'notistack';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width:768px)');

  const handleLogout = () => {
    logout();
    enqueueSnackbar('Logged out successfully', { variant: 'info' });
    navigate('/login');
    setDrawerOpen(false);
  };

  const navLinks = [
    { text: 'Home', to: '/' },
    { text: 'Estimate', to: '/estimate' },
    { text: 'History', to: '/history' },
    { text: 'Subscription', to: '/subscribe' },
  ];

  const drawerContent = (
    <Box sx={{ width: 250 }} role="presentation" onClick={() => setDrawerOpen(false)}>
      <List>
        {user &&
          navLinks.map((link) => (
            <ListItem button component={Link} to={link.to} key={link.text}>
              <ListItemText primary={link.text} />
            </ListItem>
          ))}
        <Divider />
        {!user ? (
          <ListItem button component={Link} to="/login">
            <ListItemText primary="Login" />
          </ListItem>
        ) : (
          <ListItem button onClick={handleLogout}>
            <ListItemText primary="Logout" />
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <>
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

          {isMobile ? (
            <IconButton color="inherit" edge="end" onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
          ) : (
            <Box sx={{ display: 'flex', gap: 2 }}>
              {user &&
                navLinks.map((link) => (
                  <Button key={link.text} color="inherit" component={Link} to={link.to}>
                    {link.text}
                  </Button>
                ))}
              {!user ? (
                <Button color="inherit" component={Link} to="/login">
                  Login
                </Button>
              ) : (
                <Button color="inherit" onClick={handleLogout}>
                  Logout
                </Button>
              )}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Navbar;
