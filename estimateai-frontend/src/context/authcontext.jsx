// import React, { createContext, useState, useEffect } from 'react';

// export const AuthContext = createContext();

// const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const savedUser = localStorage.getItem('estimate_user');
//     if (savedUser) setUser(JSON.parse(savedUser));
//   }, []);

//   const login = (username) => {
//     setUser({ username });
//     localStorage.setItem('estimate_user', JSON.stringify({ username }));
//   };

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem('estimate_user');
//     localStorage.removeItem('estimate_history'); // optional
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export default AuthProvider;

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
    const userData = { username: res.data.username, token: res.data.token };
    localStorage.setItem("estimate_user", JSON.stringify(userData));
    setUser(userData);
  };

  const register = async (username, password) => {
    await axios.post(`${BASE_URL}/auth/register`, { username, password });
    return login(username, password); // auto login
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
