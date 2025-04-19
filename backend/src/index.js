const express = require('express');
const cors = require('cors');
const { auth } = require('./middleware/auth');
const { errorHandler } = require('./middleware/errorHandler');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const locationRoutes = require('./routes/location');
const livestreamRoutes = require('./routes/livestream');
const chatRoutes = require('./routes/chat');
const communityRoutes = require('./routes/community');
const guardianAIRoutes = require('./routes/guardianAI');
const emergencyContactsRoutes = require('./routes/emergencyContacts');
const userProfileRoutes = require('./routes/userProfile');
const tripRoutes = require('./routes/trip');

// Apply authentication middleware to all routes
app.use(auth);

// API Routes
app.use('/api/location', locationRoutes);
app.use('/api/livestream', livestreamRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/guardian-ai', guardianAIRoutes);
app.use('/api/emergency-contacts', emergencyContactsRoutes);
app.use('/api/profile', userProfileRoutes);
app.use('/api/trip', tripRoutes);

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 