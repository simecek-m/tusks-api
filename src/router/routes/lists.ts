import { ROUTE_LISTS } from "constant";
import List from "database/model/list";
import newListSchema from "dto/schema/list/new";
import updateListSchema from "dto/schema/list/update";
import { HttpError } from "error/HttpError";
import { UnexpectedError } from "error/UnexpectedError";
import { Router } from "express";
import { validate } from "middleware/validation/validate";

const router = Router();

// get all todo lists
router.get(`/${ROUTE_LISTS}`, async (req, res, next) => {
  try {
    const result = await List.find({ author: req.auth.payload.sub }).populate(
      "tags"
    );
    res.send(result);
  } catch (e) {
    next(new UnexpectedError(e));
  }
});

// create new todo list
router.post(
  `/${ROUTE_LISTS}`,
  validate(newListSchema),
  async (req, res, next) => {
    try {
      const result = await List.create({
        ...req.body,
        author: req.auth.payload.sub,
      });
      res.send(result);
    } catch (e) {
      next(new UnexpectedError(e));
    }
  }
);

// get specific todo list
router.get(`/${ROUTE_LISTS}/:id`, async (req, res, next) => {
  try {
    const result = await List.findOne({
      author: req.auth.payload.sub,
      _id: req.params.id,
    }).populate("tags");

    if (result) {
      res.send(result);
    } else {
      next(new HttpError(404, `Todo list (${req.params.id}) was not found!`));
    }
  } catch (e) {
    next(new UnexpectedError(e));
  }
});

// update todo list
router.put(
  `/${ROUTE_LISTS}/:id`,
  validate(updateListSchema),
  async (req, res, next) => {
    try {
      const result = await List.findOneAndUpdate(
        { author: req.auth.payload.sub, _id: req.params.id },
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );
      if (result) {
        res.send(result);
      } else {
        next(new HttpError(404, `Todo list (${req.params.id}) was not found!`));
      }
    } catch (e) {
      next(new UnexpectedError(e));
    }
  }
);

// delete todo list
router.delete(`/${ROUTE_LISTS}/:id`, async (req, res, next) => {
  try {
    const result = await List.findOneAndDelete({
      author: req.auth.payload.sub,
      _id: req.params.id,
    });

    if (result) {
      res.send(result);
    } else {
      next(new HttpError(404, `Todo list (${req.params.id}) was not found!`));
    }
  } catch (e) {
    next(new UnexpectedError(e));
  }
});

export default router;
