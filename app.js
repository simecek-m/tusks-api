// imports
const express = require('express');
const mongoose = require('mongoose');
const router = require('./router');
const bodyParser = require('body-parser');

// create express app
const app = express();

// middleware 
app.use(bodyParser.json());

// api routes
app.use('/api', router);

// mongodb connection
mongoose.connect('mongodb://localhost/todo-db', { useNewUrlParser: true}).then(
	() => console.log('Mongo DB connected successfully!'),
	error => console.log('Error while connecting mongo database!', error)
);

// run express server on specific port
app.listen(3000, () => {
	console.log('server is running...');
});