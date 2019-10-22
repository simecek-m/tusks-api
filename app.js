// imports
const { mode } = require('~config');
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
logger.info(`App is running in ${mode} mode.`);

// initialize app - fetch google public keys for validation JWT signature
fetchGooglePublickKeys();

// parse json object from request body 
app.use(bodyParser.json());

// enable all CORS
app.use(cors());

// jwt middleware - verify request Authorization header
app.use(auth);

// api protected routes
app.use('/api', protectedRoutes);

// error handling
app.use('/', unknownRoutes);
app.use(errorHandler);

// run HTTP server
httpServer.start(app);

module.exports = app;
