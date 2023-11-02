import { HttpStatus, ROUTE_TEAMS } from "constant";
import Team from "database/model/Team";
import teamSchema from "dto/schema/team";
import { HttpError } from "error/HttpError";
import { UnexpectedError } from "error/UnexpectedError";
import { Router } from "express";
import { validate } from "middleware/validation/validate";
import { IMember } from "types";

const router = Router();

// retrieve all teams user is member of
router.get(`/${ROUTE_TEAMS}`, async function (req, res, next) {
  try {
    const result = await Team.find({
      members: { $elemMatch: { user: req.auth.payload.sub } },
    });
    res.status(HttpStatus.OK).send(result);
  } catch (e) {
    next(new UnexpectedError(e));
  }
});

// create new team and set current user as owner
router.post(
  `/${ROUTE_TEAMS}`,
  validate(teamSchema),
  async function (req, res, next) {
    try {
      const currentUserAsOwner: IMember = {
        user: req.auth.payload.sub,
        role: "owner",
        pending: false,
      };
      const result = await Team.create({
        ...req.body,
        members: [currentUserAsOwner],
      });
      res.status(HttpStatus.OK).send(result);
    } catch (e) {
      next(new UnexpectedError(e));
    }
  }
);

// update team info
router.put(
  `/${ROUTE_TEAMS}/:id`,
  validate(teamSchema),
  async function (req, res, next) {
    try {
      const currentUser = req.auth.payload.sub;
      const result = await Team.findOneAndUpdate(
        {
          _id: req.params.id,
          members: {
            $elemMatch: {
              $or: [
                { user: currentUser, role: "owner", pending: false },
                { user: currentUser, role: "admin", pending: false },
              ],
            },
          },
        },
        req.body,
        { runValidators: true, new: true, rawResult: true }
      );
      if (result.lastErrorObject.updatedExisting === true) {
        res.status(HttpStatus.OK).send(result.value);
      } else {
        next(
          new HttpError(
            HttpStatus.BAD_REQUEST,
            `Team was not found or you don't have permission for this action!`
          )
        );
      }
    } catch (e) {
      next(new UnexpectedError(e));
    }
  }
);

//delete team by id
router.delete(`/${ROUTE_TEAMS}/:id`, async function (req, res, next) {
  try {
    const result = await Team.findOneAndDelete({
      _id: req.params.id,
      members: { $elemMatch: { user: req.auth.payload.sub, role: "owner" } },
    });
    if (result) {
      res.status(HttpStatus.OK).send(result);
    } else {
      next(
        new HttpError(
          HttpStatus.NOT_FOUND,
          `Team (${req.params.id}) was not found!`
        )
      );
    }
  } catch (e) {
    next(new UnexpectedError(e));
  }
});

export default router;
