import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/Authcontext';
import BASE_URL from '../services/api';
import { Typography, Card, CardContent } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // also needed
import DeleteIcon from '@mui/icons-material/Delete';



const History = () => {
  const { user } = useContext(AuthContext);
  const [estimates, setEstimates] = useState([]);
  const navigate = useNavigate();


  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this estimate?')) return;
  
    try {
      const res = await fetch(`${BASE_URL}/estimates/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: user.token,
        },
      });
  
      if (res.ok) {
        // Remove the deleted estimate from UI
        setEstimates(prev => prev.filter(est => est._id !== id));
      } else {
        alert('Failed to delete estimate');
      }
    } catch (err) {
      console.error('Delete failed:', err);
      alert('An error occurred while deleting the estimate');
    }
  };
  

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
      <Typography variant="h4" gutterBottom color='white' sx={{fontWeight:'bold'}}>Estimate History</Typography>
      {estimates.length === 0 ? (
        <Typography color='white'>No estimates found.</Typography>
      ) : (
        estimates.map((est, idx) => (
          <Card key={idx} style={{ margin: '10px 0' }}>
            <CardContent style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Typography variant="subtitle1">Estimate Title: {est.title}</Typography>
            <Typography variant="body2">Total: ₹{est.totalCost}</Typography>
            <Typography variant="caption">Date: {new Date(est.date).toLocaleString()}</Typography>
          </div>

          <div>
            <IconButton
              color="secondary"
              onClick={() => navigate(`/edit-estimate/${est._id}`, { state: { estimateData: est } })}
              title="Edit"
            >
              <EditIcon />
            </IconButton>

            <IconButton
              color="error"
              onClick={() => handleDelete(est._id)}
              title="Delete"
            >
              <DeleteIcon />
            </IconButton>
          </div>
        </CardContent>


          </Card>
        ))
      )}
    </div>
  );
};

export default History;
