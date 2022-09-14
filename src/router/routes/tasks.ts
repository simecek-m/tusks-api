import List from "database/model/list";
import Task from "database/model/task";
import { HttpError } from "error/HttpError";
import { UnexpectedError } from "error/UnexpectedError";
import { Router } from "express";

const router = Router();

// get all tasks from specific todo list
router.get("/lists/:id/tasks", function (req, res, next) {
  List.findOne({ author: req.auth.payload.sub, _id: req.params.id })
    .then((data) => {
      if (data) {
        res.send(data.tasks);
      } else {
        next(new HttpError(404, `Todo list (${req.params.id}) was not found!`));
      }
    })
    .catch((e) => next(new UnexpectedError(e)));
});

// get specific task from specific todo list
router.get("/lists/:listId/tasks/:taskId", function (req, res, next) {
  List.findOne({
    author: req.auth.payload.sub,
    _id: req.params.listId,
    tasks: { $elemMatch: { _id: req.params.taskId } },
  })
    .then((data) => {
      if (data) {
        res.send(
          data.tasks.find((task) => task.id.toString() == req.params.taskId)
        );
      } else {
        next(
          new HttpError(
            404,
            `Todo list (${req.params.listId}) or Task (${req.params.taskId}) was not found!`
          )
        );
      }
    })
    .catch((e) => next(new UnexpectedError(e)));
});

// create task and add it to todo list
router.post("/lists/:id/tasks", function (req, res, next) {
  const newTask = new Task(req.body);
  List.findOneAndUpdate(
    {
      author: req.auth.payload.sub,
      _id: req.params.id,
    },
    { $push: { tasks: { ...newTask } } },
    { runValidators: true, new: true }
  )
    .then((data) => {
      if (data) {
        res.send(data.tasks.find((task) => task.id == newTask.id));
      } else {
        next(new HttpError(404, `Todo list (${req.params.id}) was not found!`));
      }
    })
    .catch((e) => next(new UnexpectedError(e)));
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
    {
      runValidators: true,
      new: true,
    }
  )
    .then((data) => {
      if (data) {
        res.send(
          data.tasks.find((task) => task.id.toString() == req.params.taskId)
        );
      } else {
        next(
          new HttpError(
            404,
            `Todo list (${req.params.listId}) or Task (${req.params.taskId}) was not found!`
          )
        );
      }
    })
    .catch((e) => next(new UnexpectedError(e)));
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
    .then((data) => {
      if (data) {
        res.send(
          data.tasks.find((task) => task.id.toString() == req.params.taskId)
        );
      } else {
        next(
          new HttpError(
            404,
            `Todo list (${req.params.listId}) or Task (${req.params.taskId}) was not found!`
          )
        );
      }
    })
    .catch((e) => next(new UnexpectedError(e)));
});

export default router;
