const mongoose = require('mongoose');

const EstimateSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  input: String,
  materials: Array,
  labor: Array,
  totalCost: Number,
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Estimate', EstimateSchema);
