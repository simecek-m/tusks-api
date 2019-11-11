const dotenv = require('dotenv');
const defaults = require('~defaults');
const createLogger = require('~logger/createLogger');

// dotenv config file path (dependent on app mode)
const path = `src/config/env/.${process.env.MODE || defaults.mode}.env`;

// open dotenv config file
const openDotenvFileResult = dotenv.config({ path });

// set module variables by environmental variables 
const config = {
  MODE: process.env.MODE || defaults.mode,
  LOG_LEVEL: process.env.LOG_LEVEL || defaults.logLevel,
  LOG_FOLDER: process.env.LOG_FOLDER || defaults.logFolder,
  PORT: process.env.PORT || defaults.port,
  MONGO_URL: process.env.MONGO_URL || defaults.mongoUrl,
  IP_ADDRESS: process.env.IP_ADDRESS || defaults.ipAddress,
  GOOGLE_API_KEYS_URL: process.env.GOOGLE_API_KEYS_URL || defaults.googleApiKeysUrl
};

// create logger with correct logging level and folder
const logger = createLogger(config.LOG_LEVEL, config.LOG_FOLDER);
logger.info(`Opening ${path} config file.`);
if (openDotenvFileResult.error) {
  logger.warn(`Error while reading dotenv file ${openDotenvFileResult.error.message}! Reading default values instead!`);
} else {
  logger.info(`Config file ${path} loaded successfully.`);
}

module.exports = config;
