// imports
const { MODE } = require('~config');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const errorHandler = require('~middleware/error');
const httpServer = require('~server');
const logger = require('~logger');
const auth = require('~auth');
const { fetchGooglePublickKeys } = require('~auth/google'); 

// imported routes
const protectedRoutes = require('~router/protectedRoutes');
const unknownRoutes = require('~router/unknownRoutes');

// create express app
const app = express();

async function start () {
  logger.info(`App is running in ${MODE} mode.`);

  // initialize app - fetch google public keys for validation JWT signature
  await fetchGooglePublickKeys();

  // parse json object from request body 
  app.use(bodyParser.json());

  // enable all CORS
  app.use(cors());

  // jwt middleware - verify request Authorization header
  app.use(auth.authenticate);

  // api protected routes
  app.use('/api', protectedRoutes);

  // error handling
  app.use('/', unknownRoutes);
  app.use(errorHandler);

  // run HTTP server
  await httpServer.start(app);
}

async function stop () {
  logger.info('Application was stopped!');
  await httpServer.close();
}

module.exports = {
  start,
  stop
};
