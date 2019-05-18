const mongoose = require('mongoose');
const Task = required('./task');

const todoSchema = new mongoose.Schema({
	title: {
		type: String,
		required: [true, 'Title field for todo list is required!']
	},
	tasks: [Task]
});

const Todo = mongoose.model('todo', todoSchema);

module.exports = Todo;