const { db } = require('../firebase');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SAFETY_CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes
const SAFETY_TIPS = [
  "Remember to stay aware of your surroundings at all times.",
  "Keep your phone charged and easily accessible.",
  "Share your live location with trusted contacts when traveling.",
  "Trust your instincts - if something feels wrong, it probably is.",
  "Have emergency contacts saved in your phone for quick access."
];

const COMFORTING_RESPONSES = [
  "I'm here for you. You're not alone.",
  "You're doing great! I'm always here if you need anything.",
  "I'm glad you're safe. Remember, I'm just a message away.",
  "You're stronger than you think. I'm here to support you.",
  "Your safety is my top priority. I'm always watching out for you."
];

const chatWithGuardian = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user.uid;
    const timestamp = new Date();

    // Get user's name from profile
    const userProfile = await db.collection('users').doc(userId).get();
    const userName = userProfile.data()?.name || 'there';

    // Initialize Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Prepare context for the AI
    const context = `
      You are Guardian, a friendly and supportive AI assistant for women's safety.
      The user's name is ${userName}.
      Your responses should be:
      - Warm and supportive
      - Safety-focused
      - Non-judgmental
      - Helpful and informative
      
      Current time: ${timestamp.toLocaleTimeString()}
      User message: ${message}
    `;

    // Generate response
    const result = await model.generateContent(context);
    const response = await result.response;
    const text = response.text();

    // Store chat in Firestore
    await db.collection('guardianChats').doc(userId).collection('messages').add({
      message,
      response: text,
      timestamp
    });

    // Check if user is feeling unsafe
    if (message.toLowerCase().includes('unsafe') || message.toLowerCase().includes('scared')) {
      // Suggest starting livestream
      const livestreamSuggestion = "Would you like to start a livestream so your emergency contacts can see what's happening?";
      await db.collection('guardianChats').doc(userId).collection('messages').add({
        message: 'system',
        response: livestreamSuggestion,
        timestamp: new Date()
      });
    }

    res.json({ response: text });
  } catch (error) {
    console.error('Guardian AI chat error:', error);
    res.status(500).json({ error: 'Failed to process chat message' });
  }
};

const getChatHistory = async (req, res) => {
  try {
    const userId = req.user.uid;
    const snapshot = await db
      .collection('guardianChats')
      .doc(userId)
      .collection('messages')
      .orderBy('timestamp', 'desc')
      .limit(50)
      .get();

    const history = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json(history);
  } catch (error) {
    console.error('Chat history error:', error);
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
};

// Function to perform periodic safety check-ins
const performSafetyCheckIn = async (userId) => {
  try {
    const userProfile = await db.collection('users').doc(userId).get();
    const userName = userProfile.data()?.name || 'there';

    const checkInMessage = `Hey ${userName}, just checking in — you good?`;
    
    await db.collection('guardianChats').doc(userId).collection('messages').add({
      message: 'system',
      response: checkInMessage,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Safety check-in error:', error);
  }
};

module.exports = { chatWithGuardian, getChatHistory, performSafetyCheckIn }; 