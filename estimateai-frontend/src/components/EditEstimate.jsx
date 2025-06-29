import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Grid,
  Button,
  Divider,
  Paper,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const EditEstimate = ({ estimate }) => {
  const [title, setTitle] = useState(estimate?.title || '');
  const [clientName, setClientName] = useState(estimate?.clientName || '');
  const [groups, setGroups] = useState(['Uncategorized', 'Materials', 'Labor', 'Equipment']);
  const [newGroup, setNewGroup] = useState('');
  const [notes, setNotes] = useState(estimate?.notes || '');
  const [modifier, setModifier] = useState('');

  const items = estimate?.items || [];

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

  return (
    <Paper sx={{ p: 4 }}>
      {/* Header Section */}
      <Typography variant="h5" gutterBottom fontWeight="bold">
        Edit Estimate
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            label="Estimate Title"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Client Name"
            fullWidth
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
          />
        </Grid>
      </Grid>

      {/* Group Manager */}
      <Box mt={4}>
        <Typography variant="h6" gutterBottom>Manage Groups</Typography>
        <Box display="flex" gap={2}>
          <TextField
            label="New group name"
            value={newGroup}
            onChange={(e) => setNewGroup(e.target.value)}
          />
          <Button variant="contained" onClick={handleAddGroup}>
            Add Group
          </Button>
        </Box>
      </Box>

      {/* Line Items Section */}
      <Box mt={4}>
        <Typography variant="h6" gutterBottom>Line Items</Typography>
        {items.length === 0 ? (
          <Typography color="text.secondary">No items added yet.</Typography>
        ) : (
          items.map((item, idx) => (
            <Box key={idx} mb={2} p={2} border="1px solid #ccc" borderRadius={2}>
              <Typography fontWeight="bold">{item.item}</Typography>
              <Typography>
                {item.quantity} × ₹{item.unitCost} = ₹{item.quantity * item.unitCost}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {item.group || 'Uncategorized'}
              </Typography>
            </Box>
          ))
        )}

        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          sx={{ mt: 2 }}
        >
          Add Item
        </Button>
      </Box>

      {/* Group Listings */}
      {groups.map((group, i) => (
        <Box key={i} mt={4}>
          <Typography variant="subtitle1" fontWeight="bold">
            {group}
          </Typography>
          {/* Filter and show items per group */}
          {items.filter(it => it.group === group).length === 0 ? (
            <Typography color="text.secondary">No items in this group</Typography>
          ) : (
            items
              .filter(it => it.group === group)
              .map((item, idx) => (
                <Typography key={idx}>
                  {item.item} – {item.quantity} × ₹{item.unitCost}
                </Typography>
              ))
          )}
        </Box>
      ))}

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
        <Button variant="contained" color="primary" sx={{ mt: 2 }}>
          Apply Changes
        </Button>
      </Box>

      {/* Metadata */}
      <Box mt={4}>
        <Typography variant="caption" color="text.secondary">
          Estimate Info
        </Typography>
        <Typography variant="body2">Created: {new Date(estimate.createdAt).toLocaleDateString()}</Typography>
        <Typography variant="body2">Status: {estimate.status || 'draft'}</Typography>
        <Typography variant="body2">Items: {items.length}</Typography>
      </Box>
    </Paper>
  );
};

export default EditEstimate;
