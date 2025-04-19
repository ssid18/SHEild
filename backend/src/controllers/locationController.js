const { db } = require('../firebase');
const fetch = require('node-fetch');

const updateLocation = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    const userId = req.user.uid;

    // Get readable location using Nominatim
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
    );
    const locationData = await response.json();
    const readableLocation = locationData.display_name;

    // Store in Firestore
    await db.collection('userLocations').doc(userId).collection('history').add({
      coordinates: {
        latitude,
        longitude
      },
      readableLocation,
      timestamp: new Date()
    });

    // Update current location
    await db.collection('userLocations').doc(userId).set({
      currentLocation: {
        coordinates: { latitude, longitude },
        readableLocation,
        lastUpdated: new Date()
      }
    });

    res.json({ success: true, readableLocation });
  } catch (error) {
    console.error('Location update error:', error);
    res.status(500).json({ error: 'Failed to update location' });
  }
};

const getLocationHistory = async (req, res) => {
  try {
    const userId = req.user.uid;
    const snapshot = await db
      .collection('userLocations')
      .doc(userId)
      .collection('history')
      .orderBy('timestamp', 'desc')
      .limit(50)
      .get();

    const history = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json(history);
  } catch (error) {
    console.error('Location history error:', error);
    res.status(500).json({ error: 'Failed to fetch location history' });
  }
};

module.exports = { updateLocation, getLocationHistory }; 