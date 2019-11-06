const { MAIN_LOGGER } = require('~constants');
const winston = require('winston');

module.exports = winston.loggers.get(MAIN_LOGGER);
