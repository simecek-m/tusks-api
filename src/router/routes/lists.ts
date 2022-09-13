import { Router } from "express";
import List from "database/model/list";
import { HttpError } from "error/HttpError";
import logger from "logger";

const router = Router();

// get all todo lists
router.get("/lists", function (req, res, next) {
  List.find({ author: req.auth.payload.sub })
    .populate("tags")
    .then((data) => res.send(data))
    .catch((e) => {
      logger.error("Unexpected error -> GET /lists endpoint: ", e);
      next(new HttpError(500, "Unexpected error"));
    });
});

// create new todo list
router.post("/lists", function (req, res, next) {
  List.create({
    ...req.body,
    author: req.auth.payload.sub,
  })
    .then((data) => res.send(data))
    .catch((e) => {
      logger.error("Unexpected error -> POST /lists endpoint: ", e);
      next(new HttpError(500, "Unexpected error"));
    });
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
    .catch((e) => {
      logger.error("Unexpected error -> GET /lists/:id endpoint: ", e);
      next(new HttpError(500, "Unexpected error"));
    });
});

// update todo list
router.put("/lists/:id", function (req, res, next) {
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
    .catch((e) => {
      logger.error("Unexpected error -> PUT /lists/:id endpoint: ", e);
      next(new HttpError(500, "Unexpected error"));
    });
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
    .catch((e) => {
      logger.error("Unexpected error -> DELETE /lists/:id endpoint: ", e);
      next(new HttpError(500, "Unexpected error"));
    });
});

export default router;
