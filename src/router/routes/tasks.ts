import { ROUTE_PROJECTS, ROUTE_TASKS } from "constant";
import Project from "database/model/Project";
import Task from "database/model/Task";
import { HttpError } from "error/HttpError";
import { UnexpectedError } from "error/UnexpectedError";
import { Router } from "express";

const router = Router();

// retrieve all tasks from specific project
router.get(`/${ROUTE_PROJECTS}/:id/${ROUTE_TASKS}`, async (req, res, next) => {
  try {
    const result = await Project.findOne({
      _id: req.params.id,
      author: req.auth.payload.sub,
    });
    if (result) {
      res.send(result.tasks);
    } else {
      next(new HttpError(404, `Project (${req.params.id}) was not found!`));
    }
  } catch (e) {
    next(new UnexpectedError(e));
  }
});

// retrieve specific task by from specific project
router.get(
  `/${ROUTE_PROJECTS}/:projectId/${ROUTE_TASKS}/:taskId`,
  async (req, res, next) => {
    try {
      const result = await Project.findOne({
        _id: req.params.projectId,
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
            `Project (${req.params.projectId}) or Task (${req.params.taskId}) was not found!`
          )
        );
      }
    } catch (e) {
      next(new UnexpectedError(e));
    }
  }
);

// create new task and push it into project
router.post(`/${ROUTE_PROJECTS}/:id/${ROUTE_TASKS}`, async (req, res, next) => {
  try {
    const newTask = new Task(req.body);
    const result = await Project.findOneAndUpdate(
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
      next(new HttpError(404, `Project (${req.params.id}) was not found!`));
    }
  } catch (e) {
    next(new UnexpectedError(e));
  }
});

// update specific task - only isCompleted field is updated
router.put(
  `/${ROUTE_PROJECTS}/:projectId/${ROUTE_TASKS}/:taskId`,
  async (req, res, next) => {
    try {
      const result = await Project.findOneAndUpdate(
        {
          _id: req.params.projectId,
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
            `Project (${req.params.projectId}) or Task (${req.params.taskId}) was not found!`
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
  `/${ROUTE_PROJECTS}/:projectId/${ROUTE_TASKS}/:taskId`,
  async (req, res, next) => {
    try {
      const result = await Project.findOneAndUpdate(
        {
          _id: req.params.projectId,
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
            `Project (${req.params.projectId}) or Task (${req.params.taskId}) was not found!`
          )
        );
      }
    } catch (e) {
      next(new UnexpectedError(e));
    }
  }
);

export default router;
