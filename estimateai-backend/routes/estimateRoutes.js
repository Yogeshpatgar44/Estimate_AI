const express = require('express');
const router = express.Router();
const { generateEstimate,saveEstimate, getEstimates,updateEstimate,getEstimateById,deleteEstimate } = require('../controllers/estimateController');
const verifyToken = require('../middleware/authMiddleware');
const requireAuth = require('../middleware/authMiddleware');

router.post('/generate', generateEstimate);
router.post('/save', verifyToken, saveEstimate);
router.get('/history', verifyToken, getEstimates);
router.patch('/:id', requireAuth, updateEstimate);
router.get('/:id', requireAuth, getEstimateById);
router.delete('/:id', requireAuth, deleteEstimate);




module.exports = router;
