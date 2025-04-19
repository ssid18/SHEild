const { db } = require('../firebase');

const shareTrip = async (req, res) => {
  try {
    const userId = req.user.uid;
    const {
      transportMode,
      startLocation,
      destination,
      estimatedDuration,
      cabNumber,
      driverName,
      driverNumber
    } = req.body;

    const tripData = {
      userId,
      transportMode,
      startLocation,
      destination,
      estimatedDuration,
      startTime: new Date(),
      status: 'active',
      createdAt: new Date()
    };

    // Add transport-specific details
    if (transportMode === 'cab') {
      tripData.cabDetails = {
        cabNumber,
        driverName,
        driverNumber
      };
    }

    // Create trip document
    const tripRef = await db.collection('trips').add(tripData);

    // Get emergency contacts
    const contactsSnapshot = await db
      .collection('emergencyContacts')
      .doc(userId)
      .collection('contacts')
      .get();

    const contacts = contactsSnapshot.docs.map(doc => doc.id);

    // Create chat messages for each contact
    const batch = db.batch();
    contacts.forEach(contactId => {
      const messageRef = db
        .collection('chats')
        .doc(`${userId}_${contactId}`)
        .collection('messages')
        .doc();

      batch.set(messageRef, {
        senderId: userId,
        receiverId: contactId,
        type: 'trip',
        content: `I'm starting a trip from ${startLocation} to ${destination} via ${transportMode}. Estimated duration: ${estimatedDuration} minutes.`,
        tripId: tripRef.id,
        timestamp: new Date()
      });
    });

    await batch.commit();

    res.json({
      success: true,
      tripId: tripRef.id
    });
  } catch (error) {
    console.error('Share trip error:', error);
    res.status(500).json({ error: 'Failed to share trip' });
  }
};

const updateTripStatus = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { tripId } = req.params;
    const { status } = req.body;

    const tripRef = db.collection('trips').doc(tripId);
    const tripDoc = await tripRef.get();

    if (!tripDoc.exists || tripDoc.data().userId !== userId) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    await tripRef.update({
      status,
      endTime: status === 'completed' ? new Date() : null
    });

    // Notify emergency contacts if trip is completed
    if (status === 'completed') {
      const contactsSnapshot = await db
        .collection('emergencyContacts')
        .doc(userId)
        .collection('contacts')
        .get();

      const contacts = contactsSnapshot.docs.map(doc => doc.id);
      const batch = db.batch();

      contacts.forEach(contactId => {
        const messageRef = db
          .collection('chats')
          .doc(`${userId}_${contactId}`)
          .collection('messages')
          .doc();

        batch.set(messageRef, {
          senderId: userId,
          receiverId: contactId,
          type: 'trip',
          content: 'I have reached my destination safely.',
          tripId,
          timestamp: new Date()
        });
      });

      await batch.commit();
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Update trip status error:', error);
    res.status(500).json({ error: 'Failed to update trip status' });
  }
};

const getActiveTrips = async (req, res) => {
  try {
    const userId = req.user.uid;
    const snapshot = await db
      .collection('trips')
      .where('userId', '==', userId)
      .where('status', '==', 'active')
      .get();

    const trips = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json(trips);
  } catch (error) {
    console.error('Get active trips error:', error);
    res.status(500).json({ error: 'Failed to get active trips' });
  }
};

const getTripHistory = async (req, res) => {
  try {
    const userId = req.user.uid;
    const snapshot = await db
      .collection('trips')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .limit(50)
      .get();

    const trips = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json(trips);
  } catch (error) {
    console.error('Get trip history error:', error);
    res.status(500).json({ error: 'Failed to get trip history' });
  }
};

module.exports = {
  shareTrip,
  updateTripStatus,
  getActiveTrips,
  getTripHistory
}; 