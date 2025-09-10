// routes/search.js
const express = require('express');
const router = express.Router();
const axios = require('axios');

// Import the token module
const { getToken } = require('../fetchToken');

// Route to handle searches
router.get('/', async (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.status(400).json({ error: 'No query provided' });
  }

  const searchApiUrl = `https://api.artsy.net/api/search?q=${encodeURIComponent(query)}&size=10&type=artist`;
  const headers = {
    'X-XAPP-Token': getToken(), // Use the getter to retrieve the token
    'Content-Type': 'application/json',
  };

  try {
    const response = await axios.get(searchApiUrl, { headers });
    res.json(response.data);
  } catch (error) {
    console.error('Error in search route:', error.message);
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;
