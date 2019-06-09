const express = require('express');
const router = express.Router();

const Todo = require('~model/todo');
const Task = require('~model/task');

// get all todo lists
router.get('/todos', function (req, res) {
  Todo.find()
    .then(data => res.send(data))
    .catch(error => {
      console.log(error);
      res.end();
    });
});

// create new todo list with default title ('Title') end empty tasks
router.post('/todos', function (req, res) {
  Todo.create({ title: 'Title' })
    .then(data => res.send(data))
    .catch(error => console.log(error));
});

// get specific todo list
router.get('/todos/:id', function (req, res, next) {
  Todo.findOne({ _id: req.params.id })
    .then(data => res.send(data))
    .catch(next);
});

// update todo list
router.put('/todos/:id', function (req, res, next) {
  Todo.updateOne({ _id: req.params.id }, req.body)
    .then(data => res.send(data))
    .catch(next);
});

// delete todo list
router.delete('/todos/:id', function (req, res, next) {
  Todo.deleteOne({ _id: req.params.id })
    .then(data => res.send(data))
    .catch(next);
});

// create task and add it to todo list
router.post('/todos/:id/tasks', function (req, res, next) {
  let task = new Task(req.body);
  Todo.updateOne({ _id: req.params.id }, { '$push': { tasks: task }}, { runValidators: true })
    .then(data => res.send(data))
    .catch(next);
});

// delete specific task
router.delete('/todos/:todoId/tasks/:taskId', function (req, res, next) {
  Todo.updateOne({ _id: req.params.todoId }, { '$pull': { tasks: { _id: req.params.taskId }}})
    .then(data => res.send(data))
    .catch(next);
});

// update specific task
router.put('/todos/:todoId/tasks/:taskId', function (req, res, next) {
  Todo.updateOne({ _id: req.params.todoId, tasks: { '$elemMatch': { _id: req.params.taskId }}}, { '$set': { 'tasks.$.completed': req.body.completed }}, { runValidators: true })
    .then(data => res.send(data))
    .catch(next);
});

module.exports = router;