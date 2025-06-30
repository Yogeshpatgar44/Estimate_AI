const express = require('express');
const router = express.Router();
const { createCheckoutSession } = require('../controllers/subscriptionController');

router.post('/create-checkout-session', createCheckoutSession);

module.exports = router;
