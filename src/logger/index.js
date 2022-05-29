const winston = require("winston");
const { LOGGER_ID } = require("~constants");

module.exports = winston.loggers.get(LOGGER_ID);
