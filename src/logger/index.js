const winston = require("winston");
const { LOGGER_ID } = require("~constants/logger");

module.exports = winston.loggers.get(LOGGER_ID);
