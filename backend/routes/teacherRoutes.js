// backend/routes/teacherRoutes.js

const express = require('express');
const router = express.Router();
// const Profile = require('../models/Teacher');
const Teacher = require('../models/Teacher');

// Save profile
router.post('/teachers', async (req, res) => {
  try {
    const { name, id, subject, email } = req.body;

    // Basic input validation
    if (!name || !id || !subject || !email) {
      return res.status(400).send('Missing required fields.');
    }

    const profile = new Teacher(req.body);
    await profile.save();
    res.status(201).json(profile); // Send JSON response
  } catch (error) {
    console.error('Error saving teacher profile:', error);
    res.status(400).json({ error: error.message || 'Error saving profile' }); // Return detailed error
  }
});


module.exports = router;
