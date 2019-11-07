const winston = require('winston');
require('winston-daily-rotate-file');
const { MAIN_LOGGER } = require('~constants');

const colorizedLogFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp(),
  winston.format.printf(
    log => `${log.timestamp} ${log.level}: ${log.message}`,
  )
);

const fileLogFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.printf(
    log => `${log.timestamp} ${log.level}: ${log.message}`,
  )
);

function createLogger (logLevel, logFolder) {
  const logger = winston.loggers.add(MAIN_LOGGER, {
    level: logLevel,
    transports: [
      new winston.transports.Console({
        format: colorizedLogFormat
      }),
      new winston.transports.DailyRotateFile({
        format: fileLogFormat,
        dirname: logFolder,
        filename: '%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true
      })
    ]
  });
  logger.silly(`Logger with ${logLevel} logging level was created.`);
  return logger;
}

module.exports = createLogger;
