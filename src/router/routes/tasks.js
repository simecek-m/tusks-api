const express = require("express");
const router = express.Router();

// models
const List = require("~model/list");
const Task = require("~model/task");

// get all tasks from specific todo list
router.get("/lists/:id/tasks", function (req, res, next) {
  List.findOne({ author: req.auth.payload.sub, _id: req.params.id })
    .then((data) => res.send(data.tasks))
    .catch(next);
});

// get specific task from specific todo list
router.get("/lists/:listId/tasks/:taskId", function (req, res, next) {
  List.findOne({
    author: req.auth.payload.sub,
    _id: req.params.listId,
    tasks: { $elemMatch: { _id: req.params.taskId } },
  })
    .then((data) =>
      res.send(data.tasks.find((task) => task._id == req.params.taskId))
    )
    .catch(next);
});

// create task and add it to todo list
router.post("/lists/:id/tasks", function (req, res, next) {
  let task = new Task(req.body);
  List.findOneAndUpdate(
    {
      author: req.auth.payload.sub,
      _id: req.params.id,
    },
    { $push: { tasks: task } },
    { runValidators: true, new: true }
  )
    .then(() => res.send(task))
    .catch(next);
});

// update specific task - only isCompleted field is updated
router.put("/lists/:listId/tasks/:taskId", function (req, res, next) {
  List.findOneAndUpdate(
    {
      author: req.auth.payload.sub,
      _id: req.params.listId,
      tasks: { $elemMatch: { _id: req.params.taskId } },
    },
    { $set: { "tasks.$.isCompleted": req.body.isCompleted } },
    { runValidators: true, new: true }
  )
    .then((data) =>
      res.send(data.tasks.find((task) => task._id == req.params.taskId))
    )
    .catch(next);
});

// delete specific task
router.delete("/lists/:listId/tasks/:taskId", function (req, res, next) {
  List.findOneAndUpdate(
    {
      author: req.auth.payload.sub,
      _id: req.params.listId,
      tasks: { $elemMatch: { _id: req.params.taskId } },
    },
    { $pull: { tasks: { _id: req.params.taskId } } }
  )
    .then((data) =>
      res.send(data.tasks.find((task) => task._id == req.params.taskId))
    )
    .catch(next);
});

module.exports = router;
