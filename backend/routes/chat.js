const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/api/chat', async (req, res) => {
  try {
    const { message, context } = req.body;
    
    // Get the model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Generate content
    const prompt = `${context}\nUser: ${message}\nAssistant:`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    res.json({ response: response.text() });
  } catch (error) {
    console.error('Error processing chat:', error);
    res.status(500).json({ error: 'Failed to process chat message' });
  }
});

module.exports = router; 