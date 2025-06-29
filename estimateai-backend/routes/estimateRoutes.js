const express = require('express');
const router = express.Router();
const { generateEstimate,saveEstimate, getEstimates,updateEstimate } = require('../controllers/estimateController');
const verifyToken = require('../middleware/authMiddleware');
const requireAuth = require('../middleware/authMiddleware');


router.post('/generate', generateEstimate);
router.post('/save', verifyToken, saveEstimate);
router.get('/history', verifyToken, getEstimates);
router.patch('/:id', requireAuth, updateEstimate);

module.exports = router;
