// imports
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const router = require('./router');
const errorHandler = require('./middleware/error');

// create express app
const app = express();

// parse json object from request body 
app.use(bodyParser.json());

// api routes
app.use('/api', router);

// error handling
app.use(errorHandler);

// mongodb connection
mongoose.connect('mongodb://localhost/todo-db', { useCreateIndex:true, useNewUrlParser: true}).then(
	() => console.log('Mongo DB connected successfully!'),
	error => console.log('Error while connecting mongo database!', error)
);

// run express server on specific port
app.listen(3000, () => {
	console.log('server is running...');
});