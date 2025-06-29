// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Estimate from './pages/Estimate';
import Login from './pages/Login';
import Register from './pages/Register';
import History from './pages/History';
import Layout from './components/Layout';
import PrivateRoute from './routes/PrivateRoute';
import EstimateEditor from './pages/EstimateEditor';
import "./App.css";
//this is main file

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Private Routes in single line */}
        <Route path="/" element={<PrivateRoute><Layout><Home /></Layout></PrivateRoute>} />
        <Route path="/estimate" element={<PrivateRoute><Layout><Estimate /></Layout></PrivateRoute>} />
        <Route path="/history" element={<PrivateRoute><Layout><History /></Layout></PrivateRoute>} />
        <Route path="/edit-estimate/:id" element={<EstimateEditor />} />
      </Routes>

    </Router>
  );
}

export default App;
