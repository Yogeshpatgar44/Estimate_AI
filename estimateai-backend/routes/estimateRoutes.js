const express = require('express');
const router = express.Router();
const { generateEstimate,saveEstimate, getEstimates } = require('../controllers/estimateController');
const verifyToken = require('../middleware/authMiddleware');

router.post('/generate', generateEstimate);
router.post('/save', verifyToken, saveEstimate);
router.get('/history', verifyToken, getEstimates);

module.exports = router;
