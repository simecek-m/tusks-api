import { ROUTE_PROJECTS } from "constant";
import Project from "database/model/Project";
import projectSchema from "dto/schema/project";
import { HttpError } from "error/HttpError";
import { UnexpectedError } from "error/UnexpectedError";
import { Router } from "express";
import { validate } from "middleware/validation/validate";
import { HttpStatus } from "constant";

const router = Router();

// retrieve all user's projects
router.get(`/${ROUTE_PROJECTS}`, async (req, res, next) => {
  const currentUser = req.auth.payload.sub;
  try {
    const result = await Project.aggregate([
      {
        $lookup: {
          from: "teams",
          localField: "share",
          foreignField: "_id",
          as: "share",
        },
      },
      {
        $lookup: {
          from: "tags",
          localField: "tags",
          foreignField: "_id",
          as: "tags",
        },
      },
      {
        $match: {
          $or: [{ owner: currentUser }, { "share.members.user": currentUser }],
        },
      },
      {
        $set: {
          share: {
            $ifNull: [{ $arrayElemAt: ["$share", 0] }, null],
          },
        },
      },
    ]);
    res.status(HttpStatus.OK).send(result);
  } catch (e) {
    next(new UnexpectedError(e));
  }
});

// create new project
router.post(
  `/${ROUTE_PROJECTS}`,
  validate(projectSchema),
  async (req, res, next) => {
    try {
      const result = await Project.create({
        ...req.body,
        owner: req.auth.payload.sub,
      });
      res.status(HttpStatus.OK).send(result);
    } catch (e) {
      next(new UnexpectedError(e));
    }
  }
);

// retrieve one specific project by id
router.get(`/${ROUTE_PROJECTS}/:id`, async (req, res, next) => {
  try {
    const result = await Project.findOne({
      _id: req.params.id,
      author: req.auth.payload.sub,
    }).populate("tags");
    if (result) {
      res.status(HttpStatus.OK).send(result);
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
});

// update one specific project by id
router.put(
  `/${ROUTE_PROJECTS}/:id`,
  validate(projectSchema),
  async (req, res, next) => {
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
        res.status(HttpStatus.OK_NO_CONTENT).send();
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

// delte one project by id
router.delete(`/${ROUTE_PROJECTS}/:id`, async (req, res, next) => {
  try {
    const result = await Project.findOneAndDelete({
      _id: req.params.id,
      author: req.auth.payload.sub,
    });
    if (result) {
      res.status(HttpStatus.OK_NO_CONTENT).send();
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
});

export default router;
