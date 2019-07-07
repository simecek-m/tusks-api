const { logLevel } = require('~config');
const winston = require('winston');
require('winston-daily-rotate-file');

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

const logger = winston.createLogger({
  level: logLevel,
  transports: [
    new winston.transports.Console(
      {
        format: colorizedLogFormat
      }
    ),
    new winston.transports.DailyRotateFile({
      format: fileLogFormat,
      filename: './logs/%DATE%.log',
      datePattern: 'YYYY-MM-DD'
    })
  ]
});

module.exports = logger;
