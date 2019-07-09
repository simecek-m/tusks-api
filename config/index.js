const dotenv = require('dotenv');
const defaults = require('~config/defaults');
const logger = require('~logger');

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

logger.info(`App running in '${process.env.MODE}' mode, opening ${path} config file!`);

// print result for opening config file into the console
const result = dotenv.config({ path });
if (result.error) {
  logger.warn(`Error while reading dotenv file ${result.error.message}, Reading default values instead`);
} else {
  logger.info(`Config file ${path} loaded successfully`);
}

// set module variables by environmental variables 
const config = {
  mode: process.env.MODE || defaults.mode,
  logLevel: process.env.LOG_LEVEL || defaults.logLevel,
  port: process.env.PORT || defaults.port,
  mongoUrl: process.env.MONGO_URL || defaults.mongoUrl
};

// using logger inside config script - undefined logLevel - delete cached version logger with info (default) log level
delete require.cache[require.resolve('../logger')];

module.exports = config;
