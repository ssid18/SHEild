const express = require('express');
const router = express.Router();
const {
  sendMessage,
  getMessages,
  getChatList
} = require('../controllers/chatController');

// Send a message to emergency contact or community
router.post('/send', sendMessage);

// Get messages with a specific contact or community
router.get('/messages/:chatId', getMessages);

// Get list of all chats (emergency contacts and community)
router.get('/list', getChatList);

module.exports = router; 