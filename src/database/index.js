const { MONGO_URL } = require('~config');
const mongoose = require('mongoose');
const logger = require('~logger');

const database = {
  async connect () {
    logger.info('Opening mongoose connection.');
    return mongoose.connect(MONGO_URL, { useCreateIndex:true, useNewUrlParser: true, useFindAndModify: false });
  },
  async disconnect () {
    logger.info('Closing mongoose connection.');
    return mongoose.disconnect();
  }
};

module.exports = database;
