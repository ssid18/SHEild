const { db } = require('../firebase');

const addEmergencyContact = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { name, phoneNumber, relationship, email } = req.body;

    const contactRef = await db
      .collection('emergencyContacts')
      .doc(userId)
      .collection('contacts')
      .add({
        name,
        phoneNumber,
        relationship,
        email,
        createdAt: new Date()
      });

    res.json({
      success: true,
      contactId: contactRef.id
    });
  } catch (error) {
    console.error('Add emergency contact error:', error);
    res.status(500).json({ error: 'Failed to add emergency contact' });
  }
};

const updateEmergencyContact = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { contactId } = req.params;
    const { name, phoneNumber, relationship, email } = req.body;

    await db
      .collection('emergencyContacts')
      .doc(userId)
      .collection('contacts')
      .doc(contactId)
      .update({
        name,
        phoneNumber,
        relationship,
        email,
        updatedAt: new Date()
      });

    res.json({ success: true });
  } catch (error) {
    console.error('Update emergency contact error:', error);
    res.status(500).json({ error: 'Failed to update emergency contact' });
  }
};

const deleteEmergencyContact = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { contactId } = req.params;

    await db
      .collection('emergencyContacts')
      .doc(userId)
      .collection('contacts')
      .doc(contactId)
      .delete();

    res.json({ success: true });
  } catch (error) {
    console.error('Delete emergency contact error:', error);
    res.status(500).json({ error: 'Failed to delete emergency contact' });
  }
};

const getEmergencyContacts = async (req, res) => {
  try {
    const userId = req.user.uid;
    const snapshot = await db
      .collection('emergencyContacts')
      .doc(userId)
      .collection('contacts')
      .get();

    const contacts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json(contacts);
  } catch (error) {
    console.error('Get emergency contacts error:', error);
    res.status(500).json({ error: 'Failed to get emergency contacts' });
  }
};

module.exports = {
  addEmergencyContact,
  updateEmergencyContact,
  deleteEmergencyContact,
  getEmergencyContacts
}; 