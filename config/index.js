const dotenv = require('dotenv');
const defaults = require('~defaults');
const createLogger = require('~logger/createLogger');

let path = '';

// pick path for config file dependent on app mode
switch (process.env.MODE) {
  case 'dev': {
    path = 'config/.dev.env';
    break;
  }
  case 'test': {
    path = 'config/.test.env';
    break;
  }
  default:
    path = 'config/.env';
    break;
}

// open dotenv config file
const openDotenvFileResult = dotenv.config({ path });

// set module variables by environmental variables 
const config = {
  mode: process.env.MODE || defaults.mode,
  logLevel: process.env.LOG_LEVEL || defaults.logLevel,
  port: process.env.PORT || defaults.port,
  mongoUrl: process.env.MONGO_URL || defaults.mongoUrl
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
