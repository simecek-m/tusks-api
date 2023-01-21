import { HttpStatus, ROUTE_TEAMS } from "constant";
import Team from "database/model/Team";
import teamSchema from "dto/schema/team";
import { HttpError } from "error/HttpError";
import { UnexpectedError } from "error/UnexpectedError";
import { Router } from "express";
import { validate } from "middleware/validation/validate";
import { IMember, ITeam } from "types";

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

// create new team and set user as member
router.post(
  `/${ROUTE_TEAMS}`,
  validate(teamSchema),
  async function (req, res, next) {
    try {
      const member: IMember = {
        user: req.auth.payload.sub,
        role: "owner",
        pending: false,
      };
      const result = await Team.create({ ...req.body, members: [member] });
      res.status(HttpStatus.OK).send(result);
    } catch (e) {
      next(new UnexpectedError(e));
    }
  }
);

// update team
router.put(
  `/${ROUTE_TEAMS}/:id`,
  validate(teamSchema),
  async function (req, res, next) {
    try {
      const team: ITeam = req.body;
      if (
        !team.members.some(
          (member) => member.role === "owner" && member.pending === false
        )
      ) {
        next(
          new HttpError(
            HttpStatus.BAD_REQUEST,
            "Team needs to have at least one owner"
          )
        );
      } else {
        const result = await Team.findOneAndUpdate(
          {
            _id: req.params.id,
            members: {
              $elemMatch: {
                user: req.auth.payload.sub,
                role: "owner",
                pending: false,
              },
            },
          },
          req.body,
          { runValidators: true, new: true }
        );
        if (result) {
          res.status(HttpStatus.OK).send(result);
        } else {
          next(
            new HttpError(
              HttpStatus.BAD_REQUEST,
              `Team was not found or you don't have permission for this action!`
            )
          );
        }
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
