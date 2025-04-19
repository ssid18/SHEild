const { db } = require('../firebase');
const crypto = require('crypto');

const generateStreamLink = () => {
  // Generate a secure random string for the stream ID
  const streamId = crypto.randomBytes(16).toString('hex');
  // In a real implementation, this would be a proper streaming service URL
  return `https://stream.sheild.app/${streamId}`;
};

const startLivestream = async (req, res) => {
  try {
    const userId = req.user.uid;
    const streamLink = generateStreamLink();
    const timestamp = new Date();

    // Store livestream metadata
    const livestreamRef = await db.collection('livestreams').add({
      userId,
      streamLink,
      status: 'active',
      startTime: timestamp,
      viewers: []
    });

    // Share in emergency contacts chat
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
        type: 'livestream',
        content: streamLink,
        timestamp
      });
    });

    await batch.commit();

    res.json({
      success: true,
      streamLink,
      livestreamId: livestreamRef.id
    });
  } catch (error) {
    console.error('Livestream start error:', error);
    res.status(500).json({ error: 'Failed to start livestream' });
  }
};

const endLivestream = async (req, res) => {
  try {
    const { livestreamId } = req.body;
    const userId = req.user.uid;

    await db.collection('livestreams').doc(livestreamId).update({
      status: 'ended',
      endTime: new Date()
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Livestream end error:', error);
    res.status(500).json({ error: 'Failed to end livestream' });
  }
};

const getLivestreamStatus = async (req, res) => {
  try {
    const userId = req.user.uid;
    const snapshot = await db
      .collection('livestreams')
      .where('userId', '==', userId)
      .where('status', '==', 'active')
      .get();

    const livestreams = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json(livestreams);
  } catch (error) {
    console.error('Livestream status error:', error);
    res.status(500).json({ error: 'Failed to get livestream status' });
  }
};

module.exports = { startLivestream, endLivestream, getLivestreamStatus }; 