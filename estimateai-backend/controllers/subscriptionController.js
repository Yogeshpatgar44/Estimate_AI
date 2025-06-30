// controllers/subscriptionController.js
const User = require('../models/User');
const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // ✅ Fix here

exports.createCheckoutSession = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer_email: user.email,
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID, // Stripe price ID from dashboard
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_URL}/subscription-success`,
      cancel_url: `${process.env.FRONTEND_URL}/subscription-cancel`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('Stripe Checkout Error:', err);
    res.status(500).json({ error: 'Stripe Checkout failed' });
  }
};
