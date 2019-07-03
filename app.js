// imports
const express = require('express');
const bodyParser = require('body-parser');
const router = require('~router');
const errorHandler = require('~middleware/error');
const httpServer = require('~server');

// create express app
const app = express();

// parse json object from request body 
app.use(bodyParser.json());

// api routes
app.use('/api', router);

// error handling
app.use(errorHandler);

httpServer.start(app);

module.exports = app;
