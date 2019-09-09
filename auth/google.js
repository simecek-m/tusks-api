const axios = require('axios');
const { googleApiKeysUrl } = require('~config');
const logger = require('~logger');

let googleKeys = null;

async function fetchGooglePublickKeys () {
  try {
    logger.info('Initializing Google public keys.');
    const response = await axios.get(googleApiKeysUrl);
    googleKeys = response.data;
  } catch (error) {
    logger.warn('Error while obtaining Google API keys.');
  }
}

function getGooglePublicKeys () {
  return googleKeys;
}

module.exports = { fetchGooglePublickKeys, getGooglePublicKeys };
