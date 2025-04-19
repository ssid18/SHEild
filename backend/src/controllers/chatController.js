const { db } = require('../firebase');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SAFETY_TIPS = [
  "Always trust your instincts - if something feels wrong, it probably is.",
  "Keep your phone charged and easily accessible at all times.",
  "Share your live location with trusted contacts when traveling.",
  "Be aware of your surroundings and avoid distractions like headphones.",
  "Have emergency contacts saved in your phone for quick access.",
  "Carry a personal safety alarm or whistle.",
  "Learn basic self-defense techniques.",
  "Plan your route in advance and stick to well-lit areas.",
  "Keep your valuables hidden and secure.",
  "If using public transport, sit near the driver or in well-populated areas."
];

const COMFORTING_RESPONSES = [
  "I'm here for you. You're not alone in this.",
  "Your safety is my top priority. I'm always watching out for you.",
  "You're stronger than you think. I'm here to support you.",
  "I'm glad you're safe. Remember, I'm just a message away.",
  "You're doing great! I'm always here if you need anything.",
  "Your well-being matters. I'm here to help you feel secure.",
  "You're not overreacting - your safety is important.",
  "I'm proud of you for reaching out. That's a strong thing to do.",
  "You deserve to feel safe. Let me help you with that.",
  "I'm here to listen and support you through this."
];

const generateAIResponse = async (message, userContext) => {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const context = `
    You are Guardian, a supportive AI assistant specifically designed for women's safety.
    The user's name is ${userContext.name || 'there'}.
    
    Your role is to:
    1. Provide emotional support and reassurance
    2. Offer practical safety advice
    3. Help users feel empowered and in control
    4. Be empathetic and understanding
    5. Suggest appropriate safety measures
    
    Current conversation context:
    - User message: ${message}
    - User's current location: ${userContext.location || 'unknown'}
    - Time of day: ${new Date().toLocaleTimeString()}
    
    Guidelines for responses:
    - Be warm and supportive
    - Focus on safety and empowerment
    - Provide specific, actionable advice when needed
    - Validate the user's feelings
    - Maintain a professional yet caring tone
    - Avoid generic responses
    - Consider the user's current situation
  `;

  const result = await model.generateContent(context);
  const response = await result.response;
  return response.text();
};

const sendMessage = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { message, type } = req.body;
    const timestamp = new Date();

    // Get user context
    const userDoc = await db.collection('users').doc(userId).get();
    const userData = userDoc.data() || {};
    
    // Get user's current location if available
    const locationDoc = await db.collection('userLocations').doc(userId).get();
    const locationData = locationDoc.data() || {};

    const userContext = {
      name: userData.name,
      location: locationData.currentLocation?.readableLocation
    };

    // Generate AI response
    const aiResponse = await generateAIResponse(message, userContext);

    // Determine if it's a community chat or emergency contact chat
    const isCommunityChat = type === 'community';
    const chatRef = isCommunityChat
      ? db.collection('communityChats').doc(userId)
      : db.collection('chats').doc(userId);

    // Add message to chat
    await chatRef.collection('messages').add({
      senderId: userId,
      message,
      response: aiResponse,
      timestamp,
      type: isCommunityChat ? 'community' : 'private',
      context: {
        location: userContext.location,
        time: timestamp.toISOString()
      }
    });

    // Update last message timestamp
    await chatRef.update({
      lastMessage: message,
      lastMessageTime: timestamp,
      lastMessageSender: userId,
      lastAIResponse: aiResponse
    });

    // Check for safety concerns
    const safetyKeywords = ['unsafe', 'scared', 'afraid', 'nervous', 'worried', 'followed', 'threat'];
    const hasSafetyConcern = safetyKeywords.some(keyword => 
      message.toLowerCase().includes(keyword)
    );

    if (hasSafetyConcern) {
      // Suggest starting livestream
      const livestreamSuggestion = "Would you like to start a livestream so your emergency contacts can see what's happening?";
      await chatRef.collection('messages').add({
        senderId: 'system',
        message: 'safety_alert',
        response: livestreamSuggestion,
        timestamp: new Date(),
        type: 'system'
      });
    }

    res.json({ 
      success: true,
      response: aiResponse,
      safetyConcern: hasSafetyConcern
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
};

const getMessages = async (req, res) => {
  try {
    const userId = req.user.uid;
    const chatRef = db.collection('chats').doc(userId);

    const snapshot = await chatRef
      .collection('messages')
      .orderBy('timestamp', 'desc')
      .limit(50)
      .get();

    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Failed to get messages' });
  }
};

const getChatList = async (req, res) => {
  try {
    const userId = req.user.uid;

    // Get user's chat history
    const chatSnapshot = await db
      .collection('chats')
      .doc(userId)
      .collection('messages')
      .orderBy('timestamp', 'desc')
      .limit(1)
      .get();

    const lastMessage = chatSnapshot.docs[0]?.data() || null;

    res.json({
      lastMessage,
      safetyTips: SAFETY_TIPS,
      comfortingResponses: COMFORTING_RESPONSES
    });
  } catch (error) {
    console.error('Get chat list error:', error);
    res.status(500).json({ error: 'Failed to get chat list' });
  }
};

module.exports = { sendMessage, getMessages, getChatList }; 