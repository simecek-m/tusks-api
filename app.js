// imports
const { mode } = require('~config');
const express = require('express');
const bodyParser = require('body-parser');
const errorHandler = require('~middleware/error');
const httpServer = require('~server');
const logger = require('~logger');
const auth = require('~auth');
const publicRoutes = require('~router/publicRoutes');
const protectedRoutes = require('~router/protectedRoutes');

// create express app
const app = express();
logger.info(`App is running in ${mode} mode.`);

// parse json object from request body 
app.use(bodyParser.json());

// api public routes
app.use('/api', publicRoutes);

// jwt middleware
app.use(auth);

// api protected routes
app.use('/api', protectedRoutes);

// error handling
app.use(errorHandler);

// run HTTP server
httpServer.start(app);

module.exports = app;
