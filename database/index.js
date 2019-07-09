const { mongoUrl } = require('~config');
const mongoose = require('mongoose');
const logger = require('~logger');

const database = {
  async connect () {
    logger.info('Opening mongoose connection.');
    return mongoose.connect(mongoUrl, { useCreateIndex:true, useNewUrlParser: true, useFindAndModify: false });
  },
  async disconnect () {
    logger.info('Closing mongoose connection.');
    return mongoose.disconnect();
  }
};

module.exports = database;
