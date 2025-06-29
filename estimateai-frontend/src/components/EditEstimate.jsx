// import React, { useState, useEffect } from 'react';
// import {
//   Typography,
//   Box,
//   Grid,
//   TextField,
//   Button,
//   IconButton,
//   Divider
// } from '@mui/material';
// import DeleteIcon from '@mui/icons-material/Delete';

// const EditEstimate = ({ estimate }) => {
//   const [items, setItems] = useState([]);

//   useEffect(() => {
//     // Initialize from existing estimate
//     if (estimate && (estimate.materials || estimate.labor)) {
//       const combinedItems = [
//         ...(estimate.materials || []).map(item => ({ ...item, type: 'Material' })),
//         ...(estimate.labor || []).map(item => ({ ...item, type: 'Labor' }))
//       ];
//       setItems(combinedItems);
//     }
//   }, [estimate]);

//   const handleChange = (index, field, value) => {
//     const updated = [...items];
//     updated[index][field] = field === 'quantity' || field === 'rate' ? Number(value) : value;
//     setItems(updated);
//   };

//   const handleAddItem = () => {
//     setItems([...items, { type: 'Material', item: '', quantity: 1, rate: 0 }]);
//   };

//   const handleRemoveItem = (index) => {
//     const updated = [...items];
//     updated.splice(index, 1);
//     setItems(updated);
//   };

//   const handleSaveChanges = async () => {
//     try {
//       const response = await fetch(`http://localhost:5000/api/estimates/${estimate._id}`, {
//         method: 'PATCH',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ items }),
//       });

//       const result = await response.json();
//       alert('Estimate updated successfully!');
//     } catch (err) {
//       console.error(err);
//       alert('Failed to update estimate');
//     }
//   };

//   return (
//     <Box sx={{backgroundColor:'white', padding:3}}>
//       <Typography variant="h6" gutterBottom sx={{ fontWeight:'bold' }}>
//         Edit Estimate Items
//       </Typography>

//       {items.map((item, index) => (
//         <Grid container spacing={2} key={index} alignItems="center" sx={{ mb: 1 }}>
//           <Grid item xs={2}>
//             <TextField
//               label="Type"
//               value={item.type}
//               onChange={(e) => handleChange(index, 'type', e.target.value)}
//               fullWidth
              
//             />
//           </Grid>
//           <Grid item xs={3} >
//             <TextField
//               label="Item"
//               value={item.item}
//               onChange={(e) => handleChange(index, 'item', e.target.value)}
//               fullWidth
//             />
//           </Grid>
//           <Grid item xs={2}>
//             <TextField
//               label="Qty"
//               type="number"
//               value={item.quantity}
//               onChange={(e) => handleChange(index, 'quantity', e.target.value)}
//               fullWidth
//             />
//           </Grid>
//           <Grid item xs={2}>
//             <TextField
//               label="Rate (₹)"
//               type="number"
//               value={item.rate}
//               onChange={(e) => handleChange(index, 'rate', e.target.value)}
//               fullWidth
//             />
//           </Grid>
//           <Grid item xs={2}>
//             <Typography>₹{item.quantity * item.rate}</Typography>
//           </Grid>
//           <Grid item xs={1}>
//             <IconButton onClick={() => handleRemoveItem(index)}>
//               <DeleteIcon color="error" />
//             </IconButton>
//           </Grid>
//         </Grid>
//       ))}

//       <Button variant="outlined" onClick={handleAddItem} sx={{ mt: 2 }}>
//         Add Item
//       </Button>

//       <Divider sx={{ my: 2 }} />

//       <Button variant="contained" color="primary" onClick={handleSaveChanges}>
//         Save Changes
//       </Button>
//     </Box>
//   );
// };

// export default EditEstimate;

import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  IconButton,
  Divider
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const EditEstimate = ({ estimate }) => {
  // ✅ FIX: Prevent crash if estimate is undefined
  if (!estimate || !estimate._id) {
    return <Typography color="error">Estimate data not loaded yet.</Typography>;
  }

  const [items, setItems] = useState([]);

  useEffect(() => {
    if (estimate && (estimate.materials || estimate.labor)) {
      const combinedItems = [
        ...(estimate.materials || []).map(item => ({ ...item, type: 'Material' })),
        ...(estimate.labor || []).map(item => ({ ...item, type: 'Labor' }))
      ];
      setItems(combinedItems);
    }
  }, [estimate]);

  const handleChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = field === 'quantity' || field === 'rate' ? Number(value) : value;
    setItems(updated);
  };

  const handleAddItem = () => {
    setItems([...items, { type: 'Material', item: '', quantity: 1, rate: 0 }]);
  };

  const handleRemoveItem = (index) => {
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
  };

  const handleSaveChanges = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/estimates/${estimate._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });

      const result = await response.json();
      alert('Estimate updated successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to update estimate');
    }
  };

  return (
    <Box sx={{ backgroundColor: 'white', padding: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
        Edit Estimate Items
      </Typography>

      {items.map((item, index) => (
        <Grid container spacing={2} key={index} alignItems="center" sx={{ mb: 1 }}>
          <Grid item xs={2}>
            <TextField
              label="Type"
              value={item.type}
              onChange={(e) => handleChange(index, 'type', e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="Item"
              value={item.item}
              onChange={(e) => handleChange(index, 'item', e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              label="Qty"
              type="number"
              value={item.quantity}
              onChange={(e) => handleChange(index, 'quantity', e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              label="Rate (₹)"
              type="number"
              value={item.rate}
              onChange={(e) => handleChange(index, 'rate', e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={2}>
            <Typography>₹{item.quantity * item.rate}</Typography>
          </Grid>
          <Grid item xs={1}>
            <IconButton onClick={() => handleRemoveItem(index)}>
              <DeleteIcon color="error" />
            </IconButton>
          </Grid>
        </Grid>
      ))}

      <Button variant="outlined" onClick={handleAddItem} sx={{ mt: 2 }}>
        Add Item
      </Button>

      <Divider sx={{ my: 2 }} />

      <Button variant="contained" color="primary" onClick={handleSaveChanges}>
        Save Changes
      </Button>
    </Box>
  );
};

export default EditEstimate;
