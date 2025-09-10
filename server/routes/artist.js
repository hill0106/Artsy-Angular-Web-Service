const express = require('express');
const router = express.Router();
const axios = require('axios');
const {User} = require("../models/user");
const auth = require("../middleware/auth");

// Import the token module
const { getToken } = require('../fetchToken');

// Route to fetch a single artist by ID (auth state)
router.get('/auth/:artist_id', auth, async (req, res) => {
  const { artist_id } = req.params;
  if (!artist_id) {
    return res.status(400).json({ error: 'No artist ID provided' });
  }

  const user = await User.findOne(req.user._id);
  if (!user) {
    return res.status(404).send({ message: "User not found" });
  }

  const favoriteItem = user.favorite.find(item => item.artistId.toString() === artist_id);
  if (favoriteItem) {
      return res.status(200).send(favoriteItem);
  }
  else { // artist not in DB
    const artistApiUrl = `https://api.artsy.net/api/artists/${encodeURIComponent(artist_id)}`;
    const headers = {
      'X-XAPP-Token': getToken(), // Use the getter to retrieve the token
      'Content-Type': 'application/json',
    };

    try {
      const response = await axios.get(artistApiUrl, { headers });
      const artist = response.data;
      res.status(200).json({
        artistId: artist.id,
        name: artist.name,
        birthday: artist.birthday ? artist.birthday : "",
        deathday: artist.deathday ? artist.deathday : "",
        nationality: artist.nationality ? artist.nationality : "",
        image: artist._links.thumbnail === undefined ? "/assets/images/artsy_logo.svg" : artist._links.thumbnail.href,
        isFavorite: false,
        biography: artist.biography ? artist.biography : ""
      });

    } catch (error) {
      console.error('Error in artist route:', error.message);
      res.status(500).json({ error: error.message });
    }
  }
});

// Route to fetch a single artist by ID (nonauth state)
router.get('/:artist_id', async (req, res) => {
  const { artist_id } = req.params;
  if (!artist_id) {
    return res.status(400).json({ error: 'No artist ID provided' });
  }
    const artistApiUrl = `https://api.artsy.net/api/artists/${encodeURIComponent(artist_id)}`;
    const headers = {
      'X-XAPP-Token': getToken(), // Use the getter to retrieve the token
      'Content-Type': 'application/json',
    };

    try {
      const response = await axios.get(artistApiUrl, { headers });
      const artist = response.data;
      res.status(200).json({
        artistId: artist.id,
        name: artist.name,
        birthday: artist.birthday ? artist.birthday : "",
        deathday: artist.deathday ? artist.deathday : "",
        nationality: artist.nationality ? artist.nationality : "",
        image: artist._links.thumbnail === undefined ? "/assets/images/artsy_logo.svg" : artist._links.thumbnail.href,
        isFavorite: false,
        biography: artist.biography ? artist.biography : ""
      });

    } catch (error) {
      console.error('Error in artist route:', error.message);
      res.status(500).json({ error: error.message });
    }
});

router.get('/smlr/:artist_id', auth, async (req, res) => {
  const { artist_id } = req.params;
  if (!artist_id) {
    return res.status(400).json({ error: 'No artist ID provided' });
  }

  const user = await User.findOne(req.user._id);
  if (!user) {
    return res.status(404).send({ message: "User not found" });
  }
    const artistApiUrl = `https://api.artsy.net/api/artists?similar_to_artist_id=${encodeURIComponent(artist_id)}`;
    const headers = {
      'X-XAPP-Token': getToken(), // Use the getter to retrieve the token
      'Content-Type': 'application/json',
    };

    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      const response = await axios.get(artistApiUrl, { headers });
      const artists = response.data._embedded.artists.map(item => {
        const isFav = user.favorite.find(fav => fav.artistId.toString() === item.id) ? true : false;
        return {
          artistId: item.id,
          title: item.name,
          isFavorite: isFav,
          image: item._links.thumbnail.href !== '/assets/shared/missing_image.png'
                  ? item._links.thumbnail.href
                  : 'assets/images/artsy_logo.svg'
        };
      });
      res.status(200).json(artists);
    } catch (error) {
      console.error('Error in artist route:', error.message);
      res.status(500).json({ error: error.message });
    }
});



module.exports = router;