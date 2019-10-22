const dotenv = require('dotenv');
const defaults = require('~defaults');
const createLogger = require('~logger/createLogger');

// dotenv config file path (dependent on app mode)
const path = `config/env/.${process.env.MODE || defaults.mode }.env`;

// open dotenv config file
const openDotenvFileResult = dotenv.config({ path });

// set module variables by environmental variables 
const config = {
  mode: process.env.MODE || defaults.mode,
  logLevel: process.env.LOG_LEVEL || defaults.logLevel,
  port: process.env.PORT || defaults.port,
  mongoUrl: process.env.MONGO_URL || defaults.mongoUrl,
  ipAddress: process.env.IP_ADDRESS || defaults.ipAddress,
  googleApiKeysUrl: process.env.GOOGLE_API_KEYS_URL || defaults.googleApiKeysUrl
};

// create logger with correct logging level
const logger = createLogger(config.logLevel);
logger.info(`Opening ${path} config file.`);
if (openDotenvFileResult.error) {
  logger.warn(`Error while reading dotenv file ${openDotenvFileResult.error.message}! Reading default values instead!`);
} else {
  logger.info(`Config file ${path} loaded successfully.`);
}

module.exports = config;
