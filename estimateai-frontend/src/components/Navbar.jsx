import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav style={{ padding: '10px', background: '#1976d2', color: 'white' }}>
      <Link to="/" style={{ marginRight: '10px', color: 'white' }}>Home</Link>
      <Link to="/estimate" style={{ marginRight: '10px', color: 'white' }}>Estimate</Link>
      {!user ? (
        <Link to="/login" style={{ marginRight: '10px', color: 'white' }}>Login</Link>
      ) : (
        <>
          <span style={{ marginRight: '10px' }}>Hi, {user.username}</span>
          <button onClick={logout} style={{ cursor: 'pointer' }}>Logout</button>
        </>
      )}
      <Link to="/history" style={{ marginRight: '10px', color: 'white' }}>History</Link>
    </nav>
  );
};

export default Navbar;
