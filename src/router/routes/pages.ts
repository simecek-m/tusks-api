import { ROUTE_PAGES } from "constant";
import Page from "database/model/Page";
import Project from "database/model/Project";
import { HttpError } from "error/HttpError";
import { UnexpectedError } from "error/UnexpectedError";
import { Router } from "express";
import { IProject } from "types";

const router = Router();

router.post(`/${ROUTE_PAGES}`, async (req, res, next) => {
  try {
    const { projectId } = req.body;
    const newPage = new Page(req.body);
    const result = await Project.findOneAndUpdate(
      { author: req.auth.payload.sub, _id: projectId },
      { $push: { pages: { ...newPage } } },
      { runValidators: true, new: true }
    );
    if (result) {
      res.send(result.pages.find((page) => page.id === newPage.id));
    } else {
      next(new HttpError(404, `Project (${projectId}) was not found!`));
    }
  } catch (e) {
    next(new UnexpectedError(e));
  }
});

router.get(`/${ROUTE_PAGES}/:id`, async (req, res, next) => {
  try {
    const result: IProject = await Project.findOne({
      author: req.auth.payload.sub,
      pages: { $elemMatch: { _id: req.params.id } },
    });
    if (result) {
      console.log(result);
      res.send(
        result.pages.find((page) => page.id.toString() === req.params.id)
      );
    } else {
      next(new HttpError(404, `Page (${req.params.id}) was not found!`));
    }
  } catch (e) {
    next(new UnexpectedError(e));
  }
});

export default router;
