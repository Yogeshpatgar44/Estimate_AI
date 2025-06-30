const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },  
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  subscription: {
    plan: { type: String, enum: ['free', 'pro'], default: 'free' },
    stripeCustomerId: { type: String },
    stripeSubscriptionId: { type: String },
    expiresAt: { type: Date },
  },
});

module.exports = mongoose.model('User', userSchema);
