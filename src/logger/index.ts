import winston from "winston";
import { LOGGER_ID } from "constant";

export default winston.loggers.get(LOGGER_ID);
