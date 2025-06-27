import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav style={{ padding: '10px', background: '#1976d2', color: 'white' }}>
      <Link to="/" style={{ marginRight: '10px', color: 'white' }}>Home</Link>
      <Link to="/estimate" style={{ marginRight: '10px', color: 'white' }}>Estimate</Link>
      <Link to="/login" style={{ marginRight: '10px', color: 'white' }}>Login</Link>
    </nav>
  );
};

export default Navbar;
