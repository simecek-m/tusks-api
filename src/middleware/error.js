const logger = require('~logger');

function errorHandling (error, req, res, next) {
  logger.error(error.message);
  res.status(error.status || 400).send(error);
  next();
}

module.exports = errorHandling;
