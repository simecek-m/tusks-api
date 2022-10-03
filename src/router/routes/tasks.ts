import { ROUTE_NOTEBOOKS, ROUTE_TASKS } from "constant";
import Notebook from "database/model/Notebook";
import Task from "database/model/Task";
import { HttpError } from "error/HttpError";
import { UnexpectedError } from "error/UnexpectedError";
import { Router } from "express";

const router = Router();

// retrieve all tasks from specific notebook
router.get(`/${ROUTE_NOTEBOOKS}/:id/${ROUTE_TASKS}`, async (req, res, next) => {
  try {
    const result = await Notebook.findOne({
      _id: req.params.id,
      author: req.auth.payload.sub,
    });
    if (result) {
      res.send(result.tasks);
    } else {
      next(new HttpError(404, `Notebook (${req.params.id}) was not found!`));
    }
  } catch (e) {
    next(new UnexpectedError(e));
  }
});

// retrieve specific task by from specific notebook
router.get(
  `/${ROUTE_NOTEBOOKS}/:notebookId/${ROUTE_TASKS}/:taskId`,
  async (req, res, next) => {
    try {
      const result = await Notebook.findOne({
        _id: req.params.notebookId,
        tasks: { $elemMatch: { _id: req.params.taskId } },
        author: req.auth.payload.sub,
      });
      if (result) {
        res.send(
          result.tasks.find((task) => task.id.toString() == req.params.taskId)
        );
      } else {
        next(
          new HttpError(
            404,
            `Notebook (${req.params.notebookId}) or Task (${req.params.taskId}) was not found!`
          )
        );
      }
    } catch (e) {
      next(new UnexpectedError(e));
    }
  }
);

// create new task and push it into notebook
router.post(
  `/${ROUTE_NOTEBOOKS}/:id/${ROUTE_TASKS}`,
  async (req, res, next) => {
    try {
      const newTask = new Task(req.body);
      const result = await Notebook.findOneAndUpdate(
        {
          _id: req.params.id,
          author: req.auth.payload.sub,
        },
        { $push: { tasks: { ...newTask } } },
        { runValidators: true, new: true }
      );
      if (result) {
        res.send(result.tasks.find((task) => task.id == newTask.id));
      } else {
        next(new HttpError(404, `Notebook (${req.params.id}) was not found!`));
      }
    } catch (e) {
      next(new UnexpectedError(e));
    }
  }
);

// update specific task - only isCompleted field is updated
router.put(
  `/${ROUTE_NOTEBOOKS}/:notebookId/${ROUTE_TASKS}/:taskId`,
  async (req, res, next) => {
    try {
      const result = await Notebook.findOneAndUpdate(
        {
          _id: req.params.notebookId,
          tasks: { $elemMatch: { _id: req.params.taskId } },
          author: req.auth.payload.sub,
        },
        { $set: { "tasks.$.isCompleted": req.body.isCompleted } },
        {
          runValidators: true,
          new: true,
        }
      );
      if (result) {
        res.send(
          result.tasks.find((task) => task.id.toString() == req.params.taskId)
        );
      } else {
        next(
          new HttpError(
            404,
            `Notebook (${req.params.notebookId}) or Task (${req.params.taskId}) was not found!`
          )
        );
      }
    } catch (e) {
      next(new UnexpectedError(e));
    }
  }
);

// delete specific task by id
router.delete(
  `/${ROUTE_NOTEBOOKS}/:notebookId/${ROUTE_TASKS}/:taskId`,
  async (req, res, next) => {
    try {
      const result = await Notebook.findOneAndUpdate(
        {
          _id: req.params.notebookId,
          tasks: { $elemMatch: { _id: req.params.taskId } },
          author: req.auth.payload.sub,
        },
        { $pull: { tasks: { _id: req.params.taskId } } }
      );
      if (result) {
        res.send(
          result.tasks.find((task) => task.id.toString() == req.params.taskId)
        );
      } else {
        next(
          new HttpError(
            404,
            `Notebook (${req.params.notebookId}) or Task (${req.params.taskId}) was not found!`
          )
        );
      }
    } catch (e) {
      next(new UnexpectedError(e));
    }
  }
);

export default router;
