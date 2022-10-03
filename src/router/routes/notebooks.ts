import { ROUTE_NOTEBOOKS } from "constant";
import Notebook from "database/model/Notebook";
import { HttpError } from "error/HttpError";
import { UnexpectedError } from "error/UnexpectedError";
import { Router } from "express";

const router = Router();

// retrieve all user's notebooks
router.get(`/${ROUTE_NOTEBOOKS}`, async (req, res, next) => {
  try {
    const result = await Notebook.find({
      author: req.auth.payload.sub,
    }).populate("tags");
    res.send(result);
  } catch (e) {
    next(new UnexpectedError(e));
  }
});

// create new notebook
router.post(`/${ROUTE_NOTEBOOKS}`, async (req, res, next) => {
  try {
    const result = await Notebook.create({
      ...req.body,
      author: req.auth.payload.sub,
    });
    res.send(result);
  } catch (e) {
    next(new UnexpectedError(e));
  }
});

// retrieve one specific notebook by id
router.get(`/${ROUTE_NOTEBOOKS}/:id`, async (req, res, next) => {
  try {
    const result = await Notebook.findOne({
      _id: req.params.id,
      author: req.auth.payload.sub,
    }).populate("tags");

    if (result) {
      res.send(result);
    } else {
      next(new HttpError(404, `Notebook (${req.params.id}) was not found!`));
    }
  } catch (e) {
    next(new UnexpectedError(e));
  }
});

// update one specific notebook by id
router.put(`/${ROUTE_NOTEBOOKS}/:id`, async (req, res, next) => {
  try {
    const result = await Notebook.findOneAndUpdate(
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
      next(new HttpError(404, `Notebook (${req.params.id}) was not found!`));
    }
  } catch (e) {
    next(new UnexpectedError(e));
  }
});

// delte one notebook by id
router.delete(`/${ROUTE_NOTEBOOKS}/:id`, async (req, res, next) => {
  try {
    const result = await Notebook.findOneAndDelete({
      _id: req.params.id,
      author: req.auth.payload.sub,
    });

    if (result) {
      res.send(result);
    } else {
      next(new HttpError(404, `Notebook (${req.params.id}) was not found!`));
    }
  } catch (e) {
    next(new UnexpectedError(e));
  }
});

export default router;
