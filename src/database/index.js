const mongoose = require('mongoose');
const logger = require('~logger');

const OPTIONS = { useCreateIndex:true, useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true };

async function connect () {
  logger.info('Opening mongoose connection.');
  return mongoose.connect(process.env.MONGO_URL, OPTIONS);
}

async function disconnect () {
  logger.info('Closing mongoose connection.');
  return mongoose.disconnect();
}

module.exports = {
  connect,
  disconnect,
  OPTIONS
};
