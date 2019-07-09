const logger = require('~logger');

function errorHandling (error, req, res, next) {
  logger.error(`Error message: ${error.message}!`);
  res.status(400).send(error);
  next();
}

module.exports = errorHandling;
