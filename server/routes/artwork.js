const express = require('express');
const router = express.Router();
const axios = require('axios');

// Import the token module
const { getToken } = require('../fetchToken');

// Route to fetch a single artist by ID
router.get('/:artist_id', async (req, res) => {
  const { artist_id } = req.params;
  if (!artist_id) {
    return res.status(400).json({ error: 'No artist ID provided' });
  }

  const artworkApiUrl = `https://api.artsy.net/api/artworks?artist_id=${encodeURIComponent(artist_id)}&size=10`;
  const headers = {
    'X-XAPP-Token': getToken(), // Use the getter to retrieve the token
    'Content-Type': 'application/json',
  };

  try {
    const response = await axios.get(artworkApiUrl, { headers });
    res.json(response.data);
  } catch (error) {
    console.error('Error in artist route:', error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;