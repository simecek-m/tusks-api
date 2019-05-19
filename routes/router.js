const express = require('express');
const router = express.Router();

const Todo = require('../model/todo');

router.get('/todos', function(req, res){
	Todo.find()
		.then(data => res.send(data))
		.catch(error => {
			console.log(error);
			res.end();
		});
});


module.exports = router;