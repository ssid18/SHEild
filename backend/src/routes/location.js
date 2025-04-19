const express = require('express');
const router = express.Router();
const { updateLocation, getLocationHistory } = require('../controllers/locationController');

// Update user's current location
router.post('/update', updateLocation);

// Get location history for a user
router.get('/history', getLocationHistory);

module.exports = router; 