const express = require('express');
const router = express.Router();
const { chatWithGuardian, getChatHistory } = require('../controllers/guardianAIController');

// Chat with Guardian AI
router.post('/chat', chatWithGuardian);

// Get chat history
router.get('/history', getChatHistory);

module.exports = router; 