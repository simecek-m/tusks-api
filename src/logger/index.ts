import winston from "winston";
import { LOGGER_ID } from "constants/logger";

export default winston.loggers.get(LOGGER_ID);
