import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Typography, Card, CardContent } from '@mui/material';

const History = () => {
  const { user } = useContext(AuthContext);
  const [estimates, setEstimates] = useState([]);

  useEffect(() => {
    if (user) {
      const history = JSON.parse(localStorage.getItem('estimate_history')) || {};
      setEstimates(history[user.username] || []);
    }
  }, [user]);

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>Estimate History</Typography>
      {estimates.length === 0 ? (
        <Typography>No past estimates found.</Typography>
      ) : (
        estimates.map((est, idx) => (
          <Card key={idx} style={{ margin: '10px 0' }}>
            <CardContent>
              <Typography variant="subtitle1">Input: {est.input}</Typography>
              <Typography variant="body2">Total: ₹{est.totalCost}</Typography>
              <Typography variant="caption">Date: {est.date}</Typography>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default History;
