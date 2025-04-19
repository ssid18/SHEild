const express = require('express');
const router = express.Router();
const { startLivestream, endLivestream, getLivestreamStatus } = require('../controllers/livestreamController');

// Start a new livestream
router.post('/start', startLivestream);

// End an active livestream
router.post('/end', endLivestream);

// Get livestream status
router.get('/status', getLivestreamStatus);

module.exports = router; 