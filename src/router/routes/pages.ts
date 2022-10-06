import { ROUTE_PAGES } from "constant";
import Page from "database/model/Page";
import Project from "database/model/Project";
import { HttpError } from "error/HttpError";
import { UnexpectedError } from "error/UnexpectedError";
import { Router } from "express";

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

export default router;
