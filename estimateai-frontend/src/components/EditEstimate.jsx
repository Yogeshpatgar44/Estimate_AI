// import React, { useState } from 'react';
// import {
//   Box,
//   Typography,
//   TextField,
//   Grid,
//   Button,
//   Divider,
//   Paper,
//   MenuItem,
//   IconButton,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow
// } from '@mui/material';
// import AddIcon from '@mui/icons-material/Add';
// import DeleteIcon from '@mui/icons-material/Delete';
// import mockEstimateItems from '../data/mockEstimateItems';

// const EditEstimate = ({ estimate }) => {
//   const [title, setTitle] = useState(estimate?.title || '');
//   const [clientName, setClientName] = useState(estimate?.clientName || '');
//   const [groups, setGroups] = useState([
//     'Uncategorized',
//     'Materials',
//     'Labor',
//     'Equipment',
//   ]);
//   const [newGroup, setNewGroup] = useState('');
//   const [notes, setNotes] = useState(estimate?.notes || '');
//   const [modifier, setModifier] = useState('');
//   const [items, setItems] = useState(estimate?.items || mockEstimateItems);

//   const handleAddGroup = () => {
//     const groupName = newGroup.trim();
//     if (groupName && !groups.includes(groupName)) {
//       setGroups([...groups, groupName]);
//       setNewGroup('');
//     }
//   };

//   const handleAddItem = () => {
//     const newItem = {
//       item: 'New Item',
//       quantity: 1,
//       unitCost: 0,
//       group: 'Uncategorized',
//     };
//     setItems([...items, newItem]);
//   };

//   const handleDeleteItem = (index) => {
//     const updated = [...items];
//     updated.splice(index, 1);
//     setItems(updated);
//   };

//   const handleItemChange = (index, field, value) => {
//     const updatedItems = [...items];
//     updatedItems[index][field] =
//       field === 'quantity' || field === 'unitCost'
//         ? parseFloat(value) || 0
//         : value;
//     setItems(updatedItems);
//   };

//   const calculateSubtotal = () =>
//     items.reduce((acc, item) => acc + item.quantity * item.unitCost, 0);

//   const subtotal = calculateSubtotal();
//   const tax = subtotal * 0.1;
//   const total = subtotal + tax;

//   return (
//     <Paper sx={{ p: 4, maxWidth: 900, margin: 'auto' }}>
//       <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mb: 4 }}>
//         Edit Estimate
//       </Typography>

//       <Grid container spacing={2}>
//         <Grid item xs={12} md={6}>
//           <TextField
//             label="Estimate Title"
//             fullWidth
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//           />
//         </Grid>
//         <Grid item xs={12} md={6}>
//           <TextField
//             label="Client Name"
//             fullWidth
//             value={clientName}
//             onChange={(e) => setClientName(e.target.value)}
//           />
//         </Grid>
//       </Grid>

//       {/* Group Manager */}
//       <Box mt={4}>
//         <Typography variant="h6" gutterBottom>
//           Manage Groups
//         </Typography>
//         <Box display="flex" gap={2}>
//           <TextField
//             label="New group name"
//             value={newGroup}
//             onChange={(e) => setNewGroup(e.target.value)}
//           />
//           <Button variant="contained" onClick={handleAddGroup}>
//             Add Group
//           </Button>
//         </Box>
//       </Box>

//       {/* Line Items */}
//       {/* Line Items */}
// <Box mt={4}>
//   <Box display="flex" justifyContent="space-between" alignItems="center">
//     <Typography variant="h6" gutterBottom>
//       Line Items
//     </Typography>
//     <Button
//       variant="outlined"
//       startIcon={<AddIcon />}
//       onClick={handleAddItem}
//     >
//       Add Item
//     </Button>
//   </Box>

//   {items.length === 0 ? (
//     <Typography color="text.secondary">No items added yet.</Typography>
//   ) : (
//     items.map((item, idx) => (
//       <Box
//         key={idx}
//         display="flex"
//         alignItems="center"
//         gap={1}
//         sx={{
//           border: '1px solid #ccc',
//           borderRadius: 1,
//           px: 2,
//           py: 1,
//           my: 1,
//           flexWrap: 'wrap',
//         }}
//       >
//         <TextField
//           label="Item"
//           value={item.item}
//           size="small"
//           onChange={(e) => handleItemChange(idx, 'item', e.target.value)}
//           sx={{ width: 160 }}
//         />
//         <TextField
//           label="Qty"
//           type="number"
//           value={item.quantity}
//           size="small"
//           onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
//           sx={{ width: 80 }}
//         />
//         <TextField
//           label="Unit ₹"
//           type="number"
//           value={item.unitCost}
//           size="small"
//           onChange={(e) => handleItemChange(idx, 'unitCost', e.target.value)}
//           sx={{ width: 100 }}
//         />
//         <TextField
//           label="Group"
//           select
//           value={item.group || 'Uncategorized'}
//           size="small"
//           onChange={(e) => handleItemChange(idx, 'group', e.target.value)}
//           sx={{ width: 140 }}
//         >
//           {groups.map((group, i) => (
//             <MenuItem key={i} value={group}>
//               {group}
//             </MenuItem>
//           ))}
//         </TextField>

//         <IconButton
//           onClick={() => handleDeleteItem(idx)}
//           color="error"
//           sx={{ ml: 'auto' }}
//         >
//           <DeleteIcon />
//         </IconButton>
//       </Box>
//     ))
//   )}
// </Box>


//       {/* Grouped Table View */}
//       <Box mt={6}>
//         <Typography variant="h6" gutterBottom>
//           Grouped Items
//         </Typography>

//         {groups.map((group, i) => {
//           const groupedItems = items.filter((it) => it.group === group);
//           if (groupedItems.length === 0) return null;

//           return (
//             <Box key={i} mt={2}>
//               <Typography variant="subtitle1" fontWeight="bold" color="primary">
//                 {group}
//               </Typography>
//               <TableContainer component={Paper}>
//                 <Table size="small">
//                   <TableHead>
//                     <TableRow>
//                       <TableCell>Item</TableCell>
//                       <TableCell>Quantity</TableCell>
//                       <TableCell>Unit Cost (₹)</TableCell>
//                       <TableCell>Total (₹)</TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {groupedItems.map((item, idx) => (
//                       <TableRow key={idx}>
//                         <TableCell>{item.item}</TableCell>
//                         <TableCell>{item.quantity}</TableCell>
//                         <TableCell>{item.unitCost}</TableCell>
//                         <TableCell>
//                           ₹{(item.quantity * item.unitCost).toFixed(2)}
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//             </Box>
//           );
//         })}
//       </Box>

//       {/* Totals */}
//       <Divider sx={{ my: 4 }} />
//       <Typography>Subtotal: ₹{subtotal.toFixed(2)}</Typography>
//       <Typography>Tax (10%): ₹{tax.toFixed(2)}</Typography>
//       <Typography fontWeight="bold">Total: ₹{total.toFixed(2)}</Typography>

//       {/* Notes */}
//       <Box mt={4}>
//         <Typography variant="h6">Notes</Typography>
//         <TextField
//           placeholder="Add any notes or terms here..."
//           value={notes}
//           onChange={(e) => setNotes(e.target.value)}
//           multiline
//           fullWidth
//           rows={4}
//         />
//       </Box>

//       {/* AI Modifier */}
//       <Box mt={4}>
//         <Typography variant="h6">AI Modifier</Typography>
//         <TextField
//           placeholder="e.g., 'Add 15% tax', 'Apply 10% discount'..."
//           value={modifier}
//           onChange={(e) => setModifier(e.target.value)}
//           fullWidth
//         />
//         <Button variant="contained" color="primary" sx={{ mt: 2 }}>
//           Apply Changes
//         </Button>
//       </Box>

//       {/* Metadata */}
//       <Box mt={4}>
//         <Typography variant="caption" color="text.secondary">
//           Estimate Info
//         </Typography>
//         <Typography variant="body2">
//           Created: {new Date(estimate.createdAt).toLocaleDateString()}
//         </Typography>
//         <Typography variant="body2">
//           Status: {estimate.status || 'draft'}
//         </Typography>
//         <Typography variant="body2">Items: {items.length}</Typography>
//       </Box>
//     </Paper>
//   );
// };

// export default EditEstimate;

import React, { useEffect, useState } from 'react';
import {
  Box, Typography, TextField, Grid, Button, Divider, Paper, IconButton, Table, TableHead, TableRow, TableCell, TableBody
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useParams } from 'react-router-dom';
import BASE_URL from '../services/api'; // your backend base URL
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';

const EditEstimate = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [estimate, setEstimate] = useState(null);

  const [title, setTitle] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [modifier, setModifier] = useState('');
  const [groups, setGroups] = useState(['Materials', 'Labor', 'Equipment']);
  const [newGroup, setNewGroup] = useState('');
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchEstimate = async () => {
      try {
        const res = await fetch(`${BASE_URL}/estimates/${id}`, {
          headers: { Authorization: user.token },
        });
        const data = await res.json();
        setEstimate(data);
        setTitle(data.title || '');
        setClientName(data.clientName || '');
        setClientEmail(data.clientEmail || '');
        setNotes(data.notes || '');
        const combinedItems = [];

        data.materials?.forEach(m => combinedItems.push({ ...m, type: 'Material' }));
        data.labor?.forEach(l => combinedItems.push({ ...l, type: 'Labor' }));
        data.equipment?.forEach(e => combinedItems.push({ ...e, type: 'Equipment' }));

        setItems(combinedItems);
      } catch (err) {
        console.error('Failed to fetch estimate', err);
      }
    };

    fetchEstimate();
  }, [id, user.token]);

  const handleAddItem = () => {
    setItems([
      ...items,
      { item: '', quantity: 0, unitCost: 0, type: 'Materials' },
    ]);
  };

  const handleDeleteItem = (index) => {
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = field === 'quantity' || field === 'unitCost' ? Number(value) : value;
    setItems(updated);
  };

  const handleSaveEstimate = async () => {
    try {
      const res = await fetch(`${BASE_URL}/estimates/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: user.token,
        },
        body: JSON.stringify({
          title,
          clientName,
          clientEmail,
          notes,
          items,
        }),
      });
  
      const data = await res.json();
      alert('Estimate updated successfully ✅');
      setEstimate(data); // update UI with latest values
    } catch (err) {
      console.error('Update failed:', err);
      alert('Failed to update estimate ❌');
    }
  };
  
  const applyModifier = () => {
    if (!modifier.trim()) return;
  
    const mod = modifier.toLowerCase();
    let newItems = [...items];
  
    if (mod.includes('discount')) {
      const match = mod.match(/(\d+)%/);
      if (match) {
        const percent = parseFloat(match[1]) / 100;
        newItems = newItems.map(item => ({
          ...item,
          unitCost: item.unitCost * (1 - percent),
        }));
      }
    }
  
    if (mod.includes('increase') || mod.includes('tax')) {
      const match = mod.match(/(\d+)%/);
      if (match) {
        const percent = parseFloat(match[1]) / 100;
        newItems = newItems.map(item => ({
          ...item,
          unitCost: item.unitCost * (1 + percent),
        }));
      }
    }
  
    setItems(newItems);
    setModifier('');
  };
  

  const handleAddGroup = () => {
    if (newGroup.trim() && !groups.includes(newGroup)) {
      setGroups([...groups, newGroup]);
      setNewGroup('');
    }
  };

  const calculateSubtotal = () =>
    items.reduce((acc, item) => acc + (item.quantity * item.unitCost), 0);

  const subtotal = calculateSubtotal();
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  if (!estimate) return <Typography>Loading...</Typography>;

  return (
    <Paper sx={{ p: 4, maxWidth: 1000, margin: 'auto' }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>Edit Estimate</Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField label="Estimate Title" fullWidth value={title} onChange={(e) => setTitle(e.target.value)} />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField label="Client Name" fullWidth value={clientName} onChange={(e) => setClientName(e.target.value)} />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField label="Client Email" fullWidth value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} />
        </Grid>
      </Grid>

      {/* Manage Groups */}
      <Box mt={4}>
        <Typography variant="h6">Manage Groups</Typography>
        <Box display="flex" gap={2} mt={1}>
          <TextField
            label="New group name"
            value={newGroup}
            onChange={(e) => setNewGroup(e.target.value)}
          />
          <Button variant="contained" onClick={handleAddGroup}>Add Group</Button>
        </Box>
      </Box>

      {/* Line Items */}
      <Box mt={4}>
        <Typography variant="h6" gutterBottom>Line Items</Typography>
        <Button variant="outlined" startIcon={<AddIcon />} onClick={handleAddItem}>Add Item</Button>

        <Box mt={2}>
          {items.map((item, idx) => (
            <Box key={idx} display="flex" alignItems="center" gap={2} mb={2}>
              <TextField
                label="Item"
                value={item.item}
                onChange={(e) => handleItemChange(idx, 'item', e.target.value)}
                size="small"
              />
              <TextField
                label="Qty"
                type="number"
                value={item.quantity}
                onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                size="small"
              />
              <TextField
                label="Unit Cost"
                type="number"
                value={item.unitCost}
                onChange={(e) => handleItemChange(idx, 'unitCost', e.target.value)}
                size="small"
              />
              <TextField
                label="Type"
                select
                SelectProps={{ native: true }}
                value={item.type}
                onChange={(e) => handleItemChange(idx, 'type', e.target.value)}
                size="small"
              >
                {groups.map((group, i) => (
                  <option key={i} value={group}>{group}</option>
                ))}
              </TextField>
              <IconButton onClick={() => handleDeleteItem(idx)}><DeleteIcon color="error" /></IconButton>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Table View by Group */}
      <Box mt={4}>
        <Typography variant="h6" gutterBottom>Items by Group</Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Group</TableCell>
              <TableCell>Item</TableCell>
              <TableCell>Qty</TableCell>
              <TableCell>Unit Cost</TableCell>
              <TableCell>Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {groups.map((group) =>
              items
                .filter(item => item.type === group)
                .map((item, i) => (
                  <TableRow key={group + i}>
                    <TableCell>{group}</TableCell>
                    <TableCell>{item.item}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>₹{item.unitCost}</TableCell>
                    <TableCell>₹{item.quantity * item.unitCost}</TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </Box>

      {/* Totals */}
      <Divider sx={{ my: 4 }} />
      <Typography>Subtotal: ₹{subtotal.toFixed(2)}</Typography>
      <Typography>Tax (10%): ₹{tax.toFixed(2)}</Typography>
      <Typography fontWeight="bold">Total: ₹{total.toFixed(2)}</Typography>

      {/* Notes */}
      <Box mt={4}>
        <Typography variant="h6">Notes</Typography>
        <TextField
          placeholder="Add any notes or terms here..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          multiline
          fullWidth
          rows={4}
        />
      </Box>

      {/* AI Modifier */}
      <Box mt={4}>
        <Typography variant="h6">AI Modifier</Typography>
        <TextField
          placeholder="e.g., 'Add 15% tax', 'Apply 10% discount'..."
          value={modifier}
          onChange={(e) => setModifier(e.target.value)}
          fullWidth
        />
        <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={applyModifier}>
          Apply Changes
        </Button>

        <Button
          variant="contained"
          color="success"
          sx={{ mt: 2, ml: 2 }}
          onClick={handleSaveEstimate}
        >
          Save Estimate
        </Button>
      </Box>
    </Paper>
  );
};

export default EditEstimate;
