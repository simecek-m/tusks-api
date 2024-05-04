import {
  HttpStatus,
  ROUTE_APPROVE,
  ROUTE_DECLINE,
  ROUTE_INVITATIONS,
} from "constant";
import Team from "database/model/Team";
import memberSchema from "dto/schema/member";
import { HttpError } from "error/HttpError";
import { UnexpectedError } from "error/UnexpectedError";
import { Router } from "express";
import { validate } from "middleware/validation/validate";
import { IMember } from "types";

const router = Router();

// get all teams user is invited to
router.get(`/${ROUTE_INVITATIONS}`, async function (req, res, next) {
  try {
    const result = await Team.find({
      members: { $elemMatch: { user: req.auth.payload.sub, pending: true } },
    });
    res.status(HttpStatus.OK).send(result);
  } catch (e) {
    next(new UnexpectedError(e));
  }
});

// invite new member to the team
router.post(
  `/${ROUTE_INVITATIONS}/:teamId`,
  validate(memberSchema),
  async function (req, res, next) {
    const currentUser = req.auth.payload.sub;
    const member: IMember = req.body;
    try {
      const response = await Team.findOneAndUpdate(
        {
          _id: req.params.teamId,
          members: {
            $elemMatch: {
              $or: [
                { user: currentUser, pending: false, role: "owner" },
                { user: currentUser, pending: false, role: "admin" },
              ],
            },
          },
          "members.user": { $ne: member.user },
        },
        { $push: { members: { ...member, pending: true } } },
        { runValidators: true, new: true, rawResult: true }
      );
      if (response.lastErrorObject.updatedExisting === true) {
        res.status(HttpStatus.OK).send(response.value);
      } else {
        next(
          new HttpError(
            HttpStatus.BAD_REQUEST,
            "You dont't have permission for this action or the user is already a member."
          )
        );
      }
    } catch (e) {
      next(new UnexpectedError(e));
    }
  }
);

// approve team invitation
router.post(
  `/${ROUTE_INVITATIONS}/:teamId/${ROUTE_APPROVE}`,
  async function (req, res, next) {
    const currentUser = req.auth.payload.sub;
    try {
      const response = await Team.findOneAndUpdate(
        {
          _id: req.params.teamId,
          members: { $elemMatch: { user: currentUser, pending: true } },
        },
        {
          $set: { "members.$.pending": false },
        },
        { runValidators: true, new: true, rawResult: true }
      );
      if (response.lastErrorObject.updatedExisting === true) {
        res.status(HttpStatus.OK).send(response.value);
      } else {
        next(
          new HttpError(
            HttpStatus.BAD_REQUEST,
            "You are not invited to this team."
          )
        );
      }
    } catch (e) {
      next(new UnexpectedError(e));
    }
  }
);

// decline team invitation
router.post(
  `/${ROUTE_INVITATIONS}/:teamId/${ROUTE_DECLINE}`,
  async function (req, res, next) {
    const currentUser = req.auth.payload.sub;
    try {
      const response = await Team.findOneAndUpdate(
        {
          _id: req.params.teamId,
          members: { $elemMatch: { user: currentUser, pending: true } },
        },
        { $pull: { members: { user: currentUser } } },
        { runValidators: true, new: true, rawResult: true }
      );
      if (response.lastErrorObject.updatedExisting === true) {
        res.status(HttpStatus.OK).send(response.value);
      } else {
        next(
          new HttpError(
            HttpStatus.BAD_REQUEST,
            "You are not invited to this team."
          )
        );
      }
    } catch (e) {
      next(new UnexpectedError(e));
    }
  }
);

export default router;
