const express = require('express');
const router = express.Router();

const Task = require('../../model/task');

// get all tasks
router.get('/tasks', function(req, res){
	Task.find()
		.then(data => res.send(data))
		.catch(error => {
			console.log(error);
			res.end();
		});
});

module.exports = router;