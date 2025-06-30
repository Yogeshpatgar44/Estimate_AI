import React, { useContext, useEffect, useState } from 'react';
import {
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Box,
  Divider,
  TextField,
  MenuItem,
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import { AuthContext } from '../context/Authcontext';
import BASE_URL from '../services/api';
import AssessmentIcon from "@mui/icons-material/Assessment";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import { IconButton } from '@mui/material';


const Home = () => {
  const { user } = useContext(AuthContext);
  const [estimates, setEstimates] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login'); // Redirect to login if not authenticated
      return;
    }

    const fetchEstimates = async () => {
      try {
        const res = await fetch(`${BASE_URL}/estimates/history`, {
          headers: { Authorization: user.token },
        });
        const data = await res.json();
        setEstimates(data.reverse());
      } catch (err) {
        console.error('Error fetching history', err);
      }
    };

    fetchEstimates();
  }, [user, navigate]);

  // Stats
  const totalEstimates = estimates.length;
  const totalValue = estimates.reduce((sum, e) => sum + (e.totalCost || 0), 0);
  const thisMonthCount = estimates.filter(
    (e) => new Date(e.date).getMonth() === new Date().getMonth()
  ).length;

  // Chart data
  const chartData = [];
  for (let i = 0; i < 12; i++) {
    const monthEstimates = estimates.filter(
      (e) => new Date(e.date).getMonth() === i
    );
    chartData.push({
      month: new Date(0, i).toLocaleString('default', { month: 'short' }),
      count: monthEstimates.length,
    });
  }

  // Filter + Search
  const filteredEstimates = estimates
    .filter((e) =>
      e.input?.toLowerCase().includes(search.toLowerCase())
    )
    .filter(
      (e) =>
        selectedMonth === '' ||
        new Date(e.date).getMonth() === parseInt(selectedMonth)
    );

    const cardStyles = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      color: '#fff',
      padding: 2,
      borderRadius: 2,
      height: '100%',
    };
    

  return (
    <Box p={3}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" color="primary" sx={{ fontWeight: 800, fontSize:40 }} >
          DASHBOARD
        </Typography>
        <Typography variant="subtitle1" color="white" sx={{  fontSize:20 }}>
          Welcome, {user?.fullName || 'Guest'}!
        </Typography>

      </Box>
      <Grid container spacing={2} sx={{display:'flex',justifyContent:"space-between"}}>
      <Grid item xs={12} md={4}>
        <Card sx={{ ...cardStyles, backgroundColor: '	#daa520', flexDirection: { xs: 'column', sm: 'row' } }}>
          <CardContent sx={{ flex: 1 }}>
            <Typography variant="subtitle2">Total Estimates</Typography>
            <Typography variant="h6">{totalEstimates}</Typography>
            <Typography variant="caption">All time</Typography>
          </CardContent>
          <AssessmentIcon fontSize="large" sx={{ mt: { xs: 1, sm: 0 } }} />
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card sx={{ ...cardStyles, backgroundColor: '#388e3c', flexDirection: { xs: 'column', sm: 'row' } }}>
          <CardContent sx={{ flex: 1 }}>
            <Typography variant="subtitle2">Total Value</Typography>
            <Typography variant="h6">₹{totalValue.toLocaleString()}</Typography>
            <Typography variant="caption">Across all estimates</Typography>
          </CardContent>
          <MonetizationOnIcon fontSize="large" sx={{ mt: { xs: 1, sm: 0 } }} />
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card sx={{ ...cardStyles, backgroundColor: '#f57c00', flexDirection: { xs: 'column', sm: 'row' } }}>
          <CardContent sx={{ flex: 1 }}>
            <Typography variant="subtitle2">This Month</Typography>
            <Typography variant="h6">{thisMonthCount}</Typography>
            <Typography variant="caption">New estimates</Typography>
          </CardContent>
          <CalendarMonthIcon fontSize="large" sx={{ mt: { xs: 1, sm: 0 } }} />
        </Card>
      </Grid>
    </Grid>
      
      <Grid item xs={12} md={10} sx={{ mt: 4 ,display:'flex',justifyContent:'center'}}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            component={Link}
            to="/estimate"
          >
            + Create New Estimate
          </Button>
        </Grid>

      {/* Bar Chart */}
      <Box mt={5}>
        <Typography variant="h6" gutterBottom color="white" sx={{fontSize:25,fontWeight:'bold' }}>
          Estimates by Month
        </Typography>
        <ResponsiveContainer width="100%" height={300}  >
          <BarChart data={chartData} >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#1976d2" />
          </BarChart>
        </ResponsiveContainer>
      </Box>

      {/* Search & Filter */}
      <Box mt={5}>

      <Grid container alignItems="center" justifyContent="space-between" spacing={2}>
      {/* Recent Estimates Title */}
      <Grid item xs={12} md={3}>
        <Typography variant="h6" color="white" sx={{ fontSize: 25, fontWeight: 'bold' }}>
          Recent Estimates
        </Typography>
      </Grid>

    
    {/* Search and Filter Inputs */}
    <Grid item xs={12} md={9}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            label="Search Estimates"
            variant="outlined"
            fullWidth
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputLabelProps={{ style: { color: 'white' } }}
            InputProps={{ style: { color: 'white' } }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'white' },
                '&:hover fieldset': { borderColor: 'white' },
                '&.Mui-focused fieldset': { borderColor: 'white' },
              },
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            label="Filter by Month"
            select
            fullWidth
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            InputLabelProps={{ style: { color: 'white' } }}
            InputProps={{ style: { color: 'white' } }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'white' },
                '&:hover fieldset': { borderColor: 'white' },
                '&.Mui-focused fieldset': { borderColor: 'white' },
              },
              '& .MuiSelect-icon': { color: 'white' },
              '& .MuiMenuItem-root': { color: 'black' }
            }}
          >
            <MenuItem value="">All</MenuItem>
            {[...Array(12).keys()].map((i) => (
              <MenuItem key={i} value={i}>
                {new Date(0, i).toLocaleString('default', { month: 'long' })}
              </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        <Divider style={{ marginBottom: '10px' }} />

        {filteredEstimates.length === 0 ? (
          <Typography variant="body2" color='white' sx={{fontWeight:10, fontSize:20}}>No estimates found.</Typography>
        ) : (
          filteredEstimates.slice(0, 5).map((est, index) => (
            <Card key={index} sx={{ marginBottom: 2 }}>
              
  <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <Box>
      <Typography variant="subtitle1">
        {est.title  || 'Untitled Estimate'}
      </Typography>
      <Typography variant="body2" color="textSecondary">
        {new Date(est.date).toLocaleDateString()} — ₹{(est.totalCost || 0).toLocaleString()}
      </Typography>
    </Box>

    <Box>
      {/* <IconButton
        color="primary"
        onClick={() => navigate(`/estimate/${est._id}`)}
        title="View"
      >
        <VisibilityIcon />
      </IconButton> */}
      <IconButton
        color="secondary"
        onClick={() => navigate(`/edit-estimate/${est._id}`, { state: { estimateData: est } })}
        title="Edit"
      >
        <EditIcon />
      </IconButton>
    </Box>
  </CardContent>
</Card>

          ))
        )}
      </Box>
    </Box>
  );
};

export default Home;
