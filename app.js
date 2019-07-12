// imports
const { mode } = require('~config');
const express = require('express');
const bodyParser = require('body-parser');
const router = require('~router');
const errorHandler = require('~middleware/error');
const httpServer = require('~server');
const logger = require('~logger');

// create express app
const app = express();
logger.info(`App is running in ${mode} mode.`);

// parse json object from request body 
app.use(bodyParser.json());

// api routes
app.use('/api', router);

// error handling
app.use(errorHandler);

// run HTTP server
httpServer.start(app);

module.exports = app;
