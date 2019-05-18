// imports
const express = require('express');
const mongoose = require('mongoose');

// create express app
const app = express();

// mongodb connection
mongoose.connect('mongodb://localhost/todo-db', { useNewUrlParser: true}).then(
	() => console.log('Mongo DB connected successfully!'),
	error => console.log('Error while connecting mongo database!', error)
);


// run express server on specific port
app.listen(3000, () => {
	console.log('server is running...')
});