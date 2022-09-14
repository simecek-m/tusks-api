import List from "database/model/list";
import newListSchema from "dto/schema/list/new";
import udateListSchema from "dto/schema/list/update";
import { HttpError } from "error/HttpError";
import { UnexpectedError } from "error/UnexpectedError";
import { Router } from "express";
import { validate } from "middleware/validation/validate";

const router = Router();

// get all todo lists
router.get("/lists", function (req, res, next) {
  List.find({ author: req.auth.payload.sub })
    .populate("tags")
    .then((data) => res.send(data))
    .catch((e) => next(new UnexpectedError(e)));
});

// create new todo list
router.post("/lists", validate(newListSchema), function (req, res, next) {
  List.create({
    ...req.body,
    author: req.auth.payload.sub,
  })
    .then((data) => res.send(data))
    .catch((e) => next(new UnexpectedError(e)));
});

// get specific todo list
router.get("/lists/:id", function (req, res, next) {
  List.findOne({ author: req.auth.payload.sub, _id: req.params.id })
    .populate("tags")
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        next(new HttpError(404, `Todo list (${req.params.id}) was not found!`));
      }
    })
    .catch((e) => next(new UnexpectedError(e)));
});

// update todo list
router.put("/lists/:id", validate(udateListSchema), function (req, res, next) {
  List.findOneAndUpdate(
    { author: req.auth.payload.sub, _id: req.params.id },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  )
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        next(new HttpError(404, `Todo list (${req.params.id}) was not found!`));
      }
    })
    .catch((e) => next(new UnexpectedError(e)));
});

// delete todo list
router.delete("/lists/:id", function (req, res, next) {
  List.findOneAndDelete({ author: req.auth.payload.sub, _id: req.params.id })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        next(new HttpError(404, `Todo list (${req.params.id}) was not found!`));
      }
    })
    .catch((e) => next(new UnexpectedError(e)));
});

export default router;
