import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('estimate_user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const login = (username) => {
    setUser({ username });
    localStorage.setItem('estimate_user', JSON.stringify({ username }));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('estimate_user');
    localStorage.removeItem('estimate_history'); // optional
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
