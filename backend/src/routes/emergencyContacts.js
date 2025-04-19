const express = require('express');
const router = express.Router();
const {
  addEmergencyContact,
  updateEmergencyContact,
  deleteEmergencyContact,
  getEmergencyContacts
} = require('../controllers/emergencyContactsController');

// Add a new emergency contact
router.post('/', addEmergencyContact);

// Update an existing emergency contact
router.put('/:contactId', updateEmergencyContact);

// Delete an emergency contact
router.delete('/:contactId', deleteEmergencyContact);

// Get all emergency contacts
router.get('/', getEmergencyContacts);

module.exports = router; 