import { ROUTE_PROJECTS } from "constant";
import Project from "database/model/Project";
import { HttpError } from "error/HttpError";
import { UnexpectedError } from "error/UnexpectedError";
import { Router } from "express";

const router = Router();

// retrieve all user's projects
router.get(`/${ROUTE_PROJECTS}`, async (req, res, next) => {
  try {
    const result = await Project.find({
      author: req.auth.payload.sub,
    }).populate("tags");
    res.send(result);
  } catch (e) {
    next(new UnexpectedError(e));
  }
});

// create new project
router.post(`/${ROUTE_PROJECTS}`, async (req, res, next) => {
  try {
    const result = await Project.create({
      ...req.body,
      author: req.auth.payload.sub,
    });
    res.send(result);
  } catch (e) {
    next(new UnexpectedError(e));
  }
});

// retrieve one specific project by id
router.get(`/${ROUTE_PROJECTS}/:id`, async (req, res, next) => {
  try {
    const result = await Project.findOne({
      _id: req.params.id,
      author: req.auth.payload.sub,
    }).populate("tags");

    if (result) {
      res.send(result);
    } else {
      next(new HttpError(404, `Project (${req.params.id}) was not found!`));
    }
  } catch (e) {
    next(new UnexpectedError(e));
  }
});

// update one specific project by id
router.put(`/${ROUTE_PROJECTS}/:id`, async (req, res, next) => {
  try {
    const result = await Project.findOneAndUpdate(
      { _id: req.params.id, author: req.auth.payload.sub },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (result) {
      res.send(result);
    } else {
      next(new HttpError(404, `Project (${req.params.id}) was not found!`));
    }
  } catch (e) {
    next(new UnexpectedError(e));
  }
});

// delte one project by id
router.delete(`/${ROUTE_PROJECTS}/:id`, async (req, res, next) => {
  try {
    const result = await Project.findOneAndDelete({
      _id: req.params.id,
      author: req.auth.payload.sub,
    });

    if (result) {
      res.send(result);
    } else {
      next(new HttpError(404, `Project (${req.params.id}) was not found!`));
    }
  } catch (e) {
    next(new UnexpectedError(e));
  }
});

export default router;
