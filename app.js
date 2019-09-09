// imports
const { mode } = require('~config');
const express = require('express');
const bodyParser = require('body-parser');
const errorHandler = require('~middleware/error');
const httpServer = require('~server');
const logger = require('~logger');
const auth = require('~auth');
const protectedRoutes = require('~router/protectedRoutes');
const cors = require('cors');
const { fetchGooglePublickKeys } = require('~auth/google'); 

// create express app
const app = express();
logger.info(`App is running in ${mode} mode.`);

// initialize app
fetchGooglePublickKeys();

// parse json object from request body 
app.use(bodyParser.json());

// enable all CORS
app.use(cors());

// jwt middleware
app.use(auth);

// api protected routes
app.use('/api', protectedRoutes);

// error handling
app.use(errorHandler);

// run HTTP server
httpServer.start(app);

module.exports = app;
