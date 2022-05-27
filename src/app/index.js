// imports
const { MODE } = require('~config');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const errorHandler = require('~middleware/error');
const httpServer = require('~server');
const logger = require('~logger');

// imported routes
const protectedRoutes = require('~router/protectedRoutes');
const unknownRoutes = require('~router/unknownRoutes');
const { checkJwt } = require('~auth');

// create express app
const app = express();

async function start () {
  logger.info(`App is running in ${MODE} mode.`);

  // parse json object from request body 
  app.use(bodyParser.json());

  // enable all CORS
  app.use(cors());

  // authentication middleware
  app.use(checkJwt);

  // api protected routes
  app.use('/api', protectedRoutes);

  // error handling
  app.use('/', unknownRoutes);
  app.use(errorHandler);

  // run HTTP server
  await httpServer.start(app);
  return app;
}

async function stop () {
  await httpServer.close();
  logger.info('Application was stopped!');
  return app;
}

module.exports = {
  start,
  stop
};
