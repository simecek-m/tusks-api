import { ROUTE_PAGES, ROUTE_PROJECTS } from "constant";
import Page from "database/model/Page";
import Project from "database/model/Project";
import pageSchema from "dto/schema/page";
import { HttpError } from "error/HttpError";
import { UnexpectedError } from "error/UnexpectedError";
import { Router } from "express";
import { validate } from "middleware/validation/validate";
import { HttpStatus } from "types";

const router = Router();

// retrieve all pages from project
router.get(
  `/${ROUTE_PROJECTS}/:projectId/${ROUTE_PAGES}`,
  async (req, res, next) => {
    const { projectId } = req.params;
    try {
      const result = await Project.findOne({
        author: req.auth.payload.sub,
        _id: projectId,
      });
      if (result) {
        res.status(HttpStatus.OK).send(result.pages);
      } else {
        next(
          new HttpError(
            HttpStatus.NOT_FOUND,
            `Project (${projectId}) was not found!`
          )
        );
      }
    } catch (e) {
      next(new UnexpectedError(e));
    }
  }
);

// add new page to project
router.post(
  `/${ROUTE_PROJECTS}/:projectId/${ROUTE_PAGES}`,
  validate(pageSchema),
  async (req, res, next) => {
    try {
      const { projectId } = req.params;
      const newPage = new Page(req.body);
      const result = await Project.findOneAndUpdate(
        { author: req.auth.payload.sub, _id: projectId },
        { $push: { pages: { ...newPage } } },
        { runValidators: true, new: true }
      );
      if (result) {
        res
          .status(HttpStatus.OK)
          .send(result.pages.find((page) => page.id === newPage.id));
      } else {
        next(
          new HttpError(
            HttpStatus.NOT_FOUND,
            `Project (${projectId}) was not found!`
          )
        );
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
    const { projectId, id } = req.params;
    try {
      const result = await Project.findOne({
        author: req.auth.payload.sub,
        _id: projectId,
      });
      if (result) {
        const page = result.pages.find((page) => page.id.toString() === id);
        if (page) {
          res.status(HttpStatus.OK).send(page);
        } else {
          next(
            new HttpError(
              HttpStatus.NOT_FOUND,
              `Page (${req.params.id}) was not found!`
            )
          );
        }
      } else {
        next(
          new HttpError(
            HttpStatus.NOT_FOUND,
            `Project (${req.params.id}) was not found!`
          )
        );
      }
    } catch (e) {
      next(new UnexpectedError(e));
    }
  }
);

router.delete(
  `/${ROUTE_PROJECTS}/:projectId/${ROUTE_PAGES}/:id`,
  async (req, res, next) => {
    const { projectId, id } = req.params;
    try {
      const result = await Project.findOneAndUpdate(
        { author: req.auth.payload.sub, _id: projectId },
        { $pull: { pages: { _id: id } } },
        { runValidators: true }
      );
      if (result) {
        if (result.pages.some((page) => page.id.toString() === id)) {
          res.status(HttpStatus.OK_NO_CONTENT).send();
        }
        next(
          new HttpError(HttpStatus.NOT_FOUND, `Page (${id}) was not found!`)
        );
      } else {
        next(
          new HttpError(
            HttpStatus.NOT_FOUND,
            `Project (${projectId}) was not found!`
          )
        );
      }
    } catch (e) {
      next(new UnexpectedError(e));
    }
  }
);

router.put(
  `/${ROUTE_PROJECTS}/:projectId/${ROUTE_PAGES}/:id`,
  validate(pageSchema),
  async (req, res, next) => {
    const { projectId, id } = req.params;
    const { name, icon, description, color, tags, content } = req.body;
    try {
      const result = await Project.findOneAndUpdate(
        {
          author: req.auth.payload.sub,
          _id: projectId,
          pages: { $elemMatch: { _id: id } },
        },
        {
          $set: {
            "pages.$.name": name,
            "pages.$.icon": icon,
            "pages.$.description": description,
            "pages.$.color": color,
            "pages.$.tags": tags,
            "pages.$.content": content,
          },
        },
        {
          runValidators: true,
        }
      );
      if (result) {
        res.status(HttpStatus.OK_NO_CONTENT).send();
      } else {
        next(
          new HttpError(
            HttpStatus.NOT_FOUND,
            `Project (${projectId}) or Page (${id}) was not found!`
          )
        );
      }
    } catch (e) {
      next(new UnexpectedError(e));
    }
  }
);

export default router;
