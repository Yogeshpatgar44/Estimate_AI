// 

import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import BASE_URL from '../services/api';
import { Typography, Card, CardContent } from '@mui/material';

const History = () => {
  const { user } = useContext(AuthContext);
  const [estimates, setEstimates] = useState([]);

  useEffect(() => {
    
    if (user?.token) {
      fetch(`${BASE_URL}/estimates/history`, {
        headers: { Authorization: user.token },
      })
        .then(res => res.json())
        .then(data => setEstimates(data))
        .catch(err => console.error(err));
    }
  }, [user]);

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>Estimate History</Typography>
      {estimates.length === 0 ? (
        <Typography>No estimates found.</Typography>
      ) : (
        estimates.map((est, idx) => (
          <Card key={idx} style={{ margin: '10px 0' }}>
            <CardContent>
              <Typography variant="subtitle1">Input: {est.input}</Typography>
              <Typography variant="body2">Total: ₹{est.totalCost}</Typography>
              <Typography variant="caption">Date: {new Date(est.date).toLocaleString()}</Typography>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default History;
