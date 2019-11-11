const axios = require('axios');
const { GOOGLE_API_KEYS_URL } = require('~config');
const logger = require('~logger');

let googleKeys = null;

async function fetchGooglePublickKeys () {
  try {
    logger.info('Initializing Google public keys.');
    const response = await axios.get(GOOGLE_API_KEYS_URL);
    googleKeys = response.data;
  } catch (error) {
    logger.warn('Error while obtaining Google API keys.');
  }
}

function getGooglePublicKeys () {
  return googleKeys;
}

module.exports = { fetchGooglePublickKeys, getGooglePublicKeys };
