import winston, { Logger } from "winston";
import { LOGGER_ID } from "constant";
import "winston-daily-rotate-file";

const colorizedLogFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp(),
  winston.format.printf(
    (log) => `${log.timestamp} ${log.level}: ${log.message}`
  )
);

const fileLogFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.printf(
    (log) => `${log.timestamp} ${log.level}: ${log.message}`
  )
);

export function createLogger(): Logger {
  const logger = winston.loggers.add(LOGGER_ID, {
    level: process.env.LOG_LEVEL,
    transports: [
      new winston.transports.Console({
        format: colorizedLogFormat,
      }),
      new winston.transports.DailyRotateFile({
        format: fileLogFormat,
        dirname: process.env.LOG_FOLDER,
        filename: "%DATE%.log",
        datePattern: "YYYY-MM-DD",
        zippedArchive: true,
      }),
    ],
    silent: process.env.MODE === "test",
  });
  logger.silly(
    `Logger with ${process.env.LOG_LEVEL} logging level was created.`
  );
  return logger;
}
