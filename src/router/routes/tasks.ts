import { ROUTE_LISTS, ROUTE_TASKS } from "constant";
import List from "database/model/list";
import Task from "database/model/task";
import newTaskSchema from "dto/schema/task/new";
import updateTaskSchema from "dto/schema/task/update";
import { HttpError } from "error/HttpError";
import { UnexpectedError } from "error/UnexpectedError";
import { Router } from "express";
import { validate } from "middleware/validation/validate";

const router = Router();

// get all tasks from specific todo list
router.get(`/${ROUTE_LISTS}/:id/${ROUTE_TASKS}`, async (req, res, next) => {
  try {
    const result = await List.findOne({
      author: req.auth.payload.sub,
      _id: req.params.id,
    });
    if (result) {
      res.send(result.tasks);
    } else {
      next(new HttpError(404, `Todo list (${req.params.id}) was not found!`));
    }
  } catch (e) {
    next(new UnexpectedError(e));
  }
});

// get specific task from specific todo list
router.get(
  `/${ROUTE_LISTS}/:listId/${ROUTE_TASKS}/:taskId`,
  async (req, res, next) => {
    try {
      const result = await List.findOne({
        author: req.auth.payload.sub,
        _id: req.params.listId,
        tasks: { $elemMatch: { _id: req.params.taskId } },
      });
      if (result) {
        res.send(
          result.tasks.find((task) => task.id.toString() == req.params.taskId)
        );
      } else {
        next(
          new HttpError(
            404,
            `Todo list (${req.params.listId}) or Task (${req.params.taskId}) was not found!`
          )
        );
      }
    } catch (e) {
      next(new UnexpectedError(e));
    }
  }
);

// create task and add it to todo list
router.post(
  `/${ROUTE_LISTS}/:id/${ROUTE_TASKS}`,
  validate(newTaskSchema),
  async (req, res, next) => {
    try {
      const newTask = new Task(req.body);
      const result = await List.findOneAndUpdate(
        {
          author: req.auth.payload.sub,
          _id: req.params.id,
        },
        { $push: { tasks: { ...newTask } } },
        { runValidators: true, new: true }
      );
      if (result) {
        res.send(result.tasks.find((task) => task.id == newTask.id));
      } else {
        next(new HttpError(404, `Todo list (${req.params.id}) was not found!`));
      }
    } catch (e) {
      next(new UnexpectedError(e));
    }
  }
);

// update specific task - only isCompleted field is updated
router.put(
  `/${ROUTE_LISTS}/:listId/${ROUTE_TASKS}/:taskId`,
  validate(updateTaskSchema),
  async (req, res, next) => {
    try {
      const result = await List.findOneAndUpdate(
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
      );
      if (result) {
        res.send(
          result.tasks.find((task) => task.id.toString() == req.params.taskId)
        );
      } else {
        next(
          new HttpError(
            404,
            `Todo list (${req.params.listId}) or Task (${req.params.taskId}) was not found!`
          )
        );
      }
    } catch (e) {
      next(new UnexpectedError(e));
    }
  }
);

// delete specific task
router.delete(
  `/${ROUTE_LISTS}/:listId/${ROUTE_TASKS}/:taskId`,
  async (req, res, next) => {
    try {
      const result = await List.findOneAndUpdate(
        {
          author: req.auth.payload.sub,
          _id: req.params.listId,
          tasks: { $elemMatch: { _id: req.params.taskId } },
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
            `Todo list (${req.params.listId}) or Task (${req.params.taskId}) was not found!`
          )
        );
      }
    } catch (e) {
      next(new UnexpectedError(e));
    }
  }
);

export default router;
