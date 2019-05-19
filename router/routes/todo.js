const express = require('express');
const router = express.Router();

const Todo = require('../../model/todo');
const Task = require('../../model/task');

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

// update todo list (rename title)
router.put('/todos/:id', function(req, res){
	Todo.updateOne({ _id: req.params.id}, { title: req.body.title })
		.then(data => res.send(data))
		.catch(error => console.log(error));
});

router.post('/todos/:id/task', function(req, res){
	Task.create({text: req.body.text})
		.then(task => {
			Todo.updateOne({_id: req.params.id}, {'$push': {tasks: task}})
				.then(data => res.send(data))
		})
		.catch(error => console.log(error));
});

module.exports = router;