const express = require('express');
const router = express.Router();
const Test = require('../models/Test');

// Save test information
router.post('/tests', async (req, res) => {
  try {
    const { testName, subject, classLevel, marks, testDate, testTime, duration } = req.body;

    // Basic input validation
    if (!testName || !subject || !classLevel || !marks || !testDate || !testTime || !duration) {
      return res.status(400).send('Missing required fields.');
    }

    const test = new Test(req.body);
    await test.save();
    res.status(201).json(test); // Send JSON response
  } catch (error) {
    console.error('Error saving test information:', error);
    res.status(400).json({ error: error.message || 'Error saving test' }); // Return detailed error
  }
});

module.exports = router;
