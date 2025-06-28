const Estimate = require('../models/Estimate');

exports.saveEstimate = async (req, res) => {
  try {
    const estimate = await Estimate.create({ user: req.user.id, ...req.body });
    res.status(201).json(estimate);
  } catch (err) {
    res.status(500).json({ message: 'Error saving estimate' });
  }
};

exports.getEstimates = async (req, res) => {
  try {
    const estimates = await Estimate.find({ user: req.user.id });
    res.json(estimates);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching estimates' });
  }
};
