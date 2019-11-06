const mongoose = require('mongoose');
const Task = require('~model/task');

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title field of todo list is required!']
  },
  tasks: [Task.schema],
  author: {
    type: String,
    required: [true, 'Author field of todo list is required!']
  }
});

const Todo = mongoose.model('todo', todoSchema);

module.exports = Todo;
