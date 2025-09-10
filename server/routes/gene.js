const express = require('express');
const router = express.Router();
const axios = require('axios');

// Import the token module
const { getToken } = require('../fetchToken');

// Route to fetch a single artist by ID
router.get('/:artwork_id', async (req, res) => {
  const { artwork_id } = req.params;
  if (!artwork_id) {
    return res.status(400).json({ error: 'No artwork ID provided' });
  }

  const geneApiUrl = `https://api.artsy.net/api/genes?artwork_id=${encodeURIComponent(artwork_id)}`;
  const headers = {
    'X-XAPP-Token': getToken(), // Use the getter to retrieve the token
    'Content-Type': 'application/json',
  };

  try {
    const response = await axios.get(geneApiUrl, { headers });
    res.json(response.data);
  } catch (error) {
    console.error('Error in artist route:', error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;