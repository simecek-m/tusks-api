const mongoose = require('mongoose');
const logger = require('~logger');

async function connect () {
  logger.info('Opening mongoose connection.');
  return mongoose.connect(process.env.MONGO_URL);
}

async function disconnect () {
  logger.info('Closing mongoose connection.');
  return mongoose.disconnect();
}

module.exports = {
  connect,
  disconnect,
};
