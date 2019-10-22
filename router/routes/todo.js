const express = require('express');
const router = express.Router();

// models
const Todo = require('~model/todo');
const Task = require('~model/task');

// get all todo lists
router.get('/todos', function (req, res, next) {
  Todo.find({ author: req.locals })
    .then(data => res.send(data))
    .catch(next);
});

// create new todo list with default title ('Title') end empty tasks
router.post('/todos', function (req, res, next) {
  Todo.create({ title: 'Title', author: req.locals })
    .then(data => res.send(data))
    .catch(next);
});

// get specific todo list
router.get('/todos/:id', function (req, res, next) {
  Todo.findOne({ author: req.locals, _id: req.params.id })
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        next({
          status: 404,
          message: `Todo list with id ${req.params.id} was not found!`
        });
      }
    })
    .catch(next);
});

// update todo list
router.put('/todos/:id', function (req, res, next) {
  Todo.findOneAndUpdate({ author: req.locals, _id: req.params.id }, req.body, { new: true })
    .then(data => res.send(data))
    .catch(next);
});

// delete todo list
router.delete('/todos/:id', function (req, res, next) {
  Todo.findOneAndDelete({ author: req.locals, _id: req.params.id })
    .then(data => res.send(data))
    .catch(next);
});

// get all tasks from specific todo list
router.get('/todos/:id/tasks', function (req, res, next) {
  Todo.findOne({ author: req.locals, _id: req.params.id })
    .then(data => res.send(data.tasks))
    .catch(next);
});

// get specific task from specific todo list
router.get('/todos/:todoId/tasks/:taskId', function (req, res, next) {
  Todo.findOne({
    author: req.locals,
    _id: req.params.todoId,
    tasks: { $elemMatch: { _id: req.params.taskId }}
  })
    .then(data =>
      res.send(data.tasks.find(task => task._id == req.params.taskId))
    )
    .catch(next);
});

// create task and add it to todo list
router.post('/todos/:id/tasks', function (req, res, next) {
  let task = new Task(req.body);
  Todo.findOneAndUpdate(
    {
      author: req.locals,
      _id: req.params.id,
    },
    { $push: { tasks: task }},
    { runValidators: true, new: true }
  )
    .then(() => res.send(task))
    .catch(next);
});

// update specific task - only completed field is updated
router.put('/todos/:todoId/tasks/:taskId', function (req, res, next) {
  Todo.findOneAndUpdate(
    {
      author: req.locals,
      _id: req.params.todoId,
      tasks: { $elemMatch: { _id: req.params.taskId }}
    },
    { $set: { 'tasks.$.completed': req.body.completed }},
    { runValidators: true, new: true }
  )
    .then(data =>
      res.send(data.tasks.find(task => task._id == req.params.taskId))
    )
    .catch(next);
});

// delete specific task
router.delete('/todos/:todoId/tasks/:taskId', function (req, res, next) {
  Todo.findOneAndUpdate(
    {
      author: req.locals,
      _id: req.params.todoId,
      tasks: { $elemMatch: { _id: req.params.taskId }}
    },
    { $pull: { tasks: { _id: req.params.taskId }}}
  )
    .then(data =>
      res.send(data.tasks.find(task => task._id == req.params.taskId))
    )
    .catch(next);
});

module.exports = router;
