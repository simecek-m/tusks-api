import { Router } from "express";
import List from "database/model/list";
import Task from "database/model/task";
import { HttpError } from "error/HttpError";
import logger from "logger";

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
    .catch((e) => {
      logger.error("Unexpected error -> GET /lists/:id/tasks endpoint: ", e);
      next(new HttpError(500, "Unexpected error"));
    });
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
    .catch((e) => {
      logger.error(
        "Unexpected error -> GET /lists/:listId/tasks/:taskId endpoint: ",
        e
      );
      next(new HttpError(500, "Unexpected error"));
    });
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
    .catch((e) => {
      logger.error("Unexpected error -> POST /lists/:id/tasks endpoint: ", e);
      next(new HttpError(500, "Unexpected error"));
    });
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
    .catch((e) => {
      logger.error(
        "Unexpected error -> PUT /lists/:listId/tasks/:taskId endpoint: ",
        e
      );
      next(new HttpError(500, "Unexpected error"));
    });
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
    .catch((e) => {
      logger.error(
        "Unexpected error -> DELETE /lists/:listId/tasks/:taskId endpoint: ",
        e
      );
      next(new HttpError(500, "Unexpected error"));
    });
});

export default router;
