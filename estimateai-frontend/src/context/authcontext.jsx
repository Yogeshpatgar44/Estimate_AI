import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import BASE_URL from '../services/api';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const data = localStorage.getItem("estimate_user");
    return data ? JSON.parse(data) : null;
  });

  const login = async (username, password) => {
    const res = await axios.post(`${BASE_URL}/auth/login`, { username, password });
  
    const userData = {
      username: res.data.username,
      fullName: res.data.fullName, // ✅ store fullName
      token: res.data.token,
    };
  
    localStorage.setItem("estimate_user", JSON.stringify(userData));
    setUser(userData);
  };
  

  const register = async ({ fullName, username, password }) => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName, username, password }),
    });
  
    if (!res.ok) throw new Error('Registration failed');
  
    const data = await res.json();
    const userData = {
      username: data.username,
      fullName: data.fullName,
      token: data.token,
    };

    localStorage.setItem('estimate_user', JSON.stringify(userData));
    setUser(userData);
  };
  

  const logout = () => {
    localStorage.removeItem("estimate_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
