import dotenv from "dotenv";
import { createLogger } from "logger/createLogger";

// .env file path (dependent on app mode)
const path = `.${process.env.MODE}.env`;

// load .env file
const loadEnvFileResult = dotenv.config({ path });
if (loadEnvFileResult.error) {
  dotenv.config();
}

// create logger with correct logging level and folder
const logger = createLogger();

// log state of loading .env file
if (loadEnvFileResult.error) {
  logger.warn(`Missing ${path} file!`);
  logger.info("Using generic .env file!");
} else {
  logger.info(`${path} loaded successfully.`);
}
