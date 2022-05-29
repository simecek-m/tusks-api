const dotenv = require("dotenv");
const createLogger = require("~logger/createLogger");

// .env file path (dependent on app mode)
const path = `.${process.env.MODE}.env`;

// load .env file
const loadEnvFileResult = dotenv.config({ path });
if (loadEnvFileResult.error) {
  dotenv.config();
}

// create logger with correct logging level and folder
const logger = createLogger(process.env.LOG_LEVEL, process.env.LOG_FOLDER);

// log state of loading .env file
if (loadEnvFileResult.error) {
  logger.warn(`Missing ${path} file!`);
  logger.info("Using generic .env file!");
} else {
  logger.info(`${path} loaded successfully.`);
}
