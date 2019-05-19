const express = require('express');
const router = express.Router();

const Todo = require('../model/todo');

// get all todo lists
router.get('/todos', function(req, res){
	Todo.find()
		.then(data => res.send(data))
		.catch(error => {
			console.log(error);
			res.end();
		});
});

// create new todo list with default title ('Title') end empty tasks
router.post('/todos', function(req, res){
	Todo.create({title: 'Title'})
		.then(data => res.send(data))
		.catch(error => console.log(error));
});

module.exports = router;