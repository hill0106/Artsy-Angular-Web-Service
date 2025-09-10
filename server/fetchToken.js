// fetchToken.js
const axios = require('axios');

// We'll keep the token in a private variable in this module
let artsyToken = '';

// The function that fetches (or refreshes) the token
async function fetchToken() {
  const url = "https://api.artsy.net/api/tokens/xapp_token?client_id=208b20e0a3e74e677cef&client_secret=87014948d402d1d0b9934dd621e5ab0f";

  try {
    const response = await axios.post(url);
    if (response.status === 200 || response.status === 201) {
      artsyToken = response.data.token || '';
      // console.log('Fetched new Artsy token successfully.', artsyToken);
    } else {
      console.error(`Failed to fetch token. Status code: ${response.status}`);
    }
  } catch (error) {
    console.error('Error while fetching token:', error.message);
  }
}

// A getter to return the current token
function getToken() {
  return artsyToken;
}

module.exports = {
  fetchToken,
  getToken,
};
