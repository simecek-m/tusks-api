// imports
const { port, mode, mongoDb } = require('./config');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const router = require('~router');
const errorHandler = require('~middleware/error');
const colors = require('colors');

// create express app
const app = express();

// parse json object from request body 
app.use(bodyParser.json());

// api routes
app.use('/api', router);

// error handling
app.use(errorHandler);

// mongodb connection
mongoose.connect(mongoDb, { useCreateIndex:true, useNewUrlParser: true }).then(
  () => console.log(colors.green(`Mongo DB located ${mongoDb} was connected successfully!`)),
  error => console.log(colors.red('Error while connecting mongo database!', error))
);

// run express server on specific port
app.listen(port || 3000, () => {
  console.log(`app is running in ${mode} mode`);
  console.log(`server is listening on port: ${port}`);
});

module.exports = app;
