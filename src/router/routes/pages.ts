import { ROUTE_PAGES, ROUTE_PROJECTS } from "constant";
import Page from "database/model/Page";
import Project from "database/model/Project";
import { HttpError } from "error/HttpError";
import { UnexpectedError } from "error/UnexpectedError";
import { Router } from "express";
import { IPage, IProject } from "types";
import { validate } from "middleware/validation/validate";
import pageSchema from "dto/schema/page";

const router = Router();

// add new page to project
router.post(
  `/${ROUTE_PROJECTS}/:projectId/${ROUTE_PAGES}`,
  validate(pageSchema),
  async (req, res, next) => {
    try {
      const { projectId } = req.params;
      const newPage: IPage = new Page(req.body);
      const result: IProject = await Project.findOneAndUpdate(
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
  }
);

// retrieve all pages from project
router.get(
  `/${ROUTE_PROJECTS}/:projectId/${ROUTE_PAGES}`,
  async (req, res, next) => {
    const { projectId } = req.params;
    try {
      const result: IProject = await Project.findOne({
        author: req.auth.payload.sub,
        id: projectId,
      });
      if (result) {
        res.send(result.pages);
      } else {
        next(new HttpError(404, `Project (${projectId}) was not found!`));
      }
    } catch (e) {
      next(new UnexpectedError(e));
    }
  }
);

// retrieve specific page from project
router.get(
  `/${ROUTE_PROJECTS}/:projectId/${ROUTE_PAGES}/:id`,
  async (req, res, next) => {
    try {
      const result: IProject = await Project.findOne({
        author: req.auth.payload.sub,
        pages: { $elemMatch: { _id: req.params.id } },
      });
      if (result) {
        res.send(
          result.pages.find((page) => page.id.toString() === req.params.id)
        );
      } else {
        next(new HttpError(404, `Page (${req.params.id}) was not found!`));
      }
    } catch (e) {
      next(new UnexpectedError(e));
    }
  }
);

export default router;
