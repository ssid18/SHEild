const express = require('express');
const router = express.Router();
const {
  shareTrip,
  updateTripStatus,
  getActiveTrips,
  getTripHistory
} = require('../controllers/tripController');

// Share a new trip
router.post('/share', shareTrip);

// Update trip status
router.put('/:tripId/status', updateTripStatus);

// Get active trips
router.get('/active', getActiveTrips);

// Get trip history
router.get('/history', getTripHistory);

module.exports = router; 