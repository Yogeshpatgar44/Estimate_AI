const mongoose = require('mongoose');

const EstimateSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: String,
  clientName: String,
  clientEmail: String,
  input: String,
  materials: Array,
  labor: Array,
  equipment: Array,
  subtotal: Number,
  tax: Number,
  totalCost: Number,
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Estimate', EstimateSchema);
