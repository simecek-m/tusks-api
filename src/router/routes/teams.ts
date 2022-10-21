import { ROUTE_TEAMS } from "constant";
import Team from "database/model/Team";
import { HttpError } from "error/HttpError";
import { UnexpectedError } from "error/UnexpectedError";
import { Router } from "express";
import { IMember } from "types";

const router = Router();

// retrieve all teams user is member of
router.get(`/${ROUTE_TEAMS}`, async function (req, res, next) {
  try {
    const result = await Team.find({
      members: { $elemMatch: { user: req.auth.payload.sub } },
    });
    res.send(result);
  } catch (e) {
    next(new UnexpectedError(e));
  }
});

// create new team and set user as member
router.post(`/${ROUTE_TEAMS}`, async function (req, res, next) {
  try {
    const member: IMember = {
      user: req.auth.payload.sub,
      role: "owner",
    };
    const result = await Team.create({ ...req.body, members: [member] });
    res.send(result);
  } catch (e) {
    next(new UnexpectedError(e));
  }
});

// update team
router.put(`/${ROUTE_TEAMS}/:id`, async function (req, res, next) {
  try {
    const result = await Team.findOneAndUpdate(
      {
        _id: req.params.id,
        members: { $elemMatch: { user: req.auth.payload.sub } },
      },
      req.body,
      { runValidators: true, new: true }
    );
    if (result) {
      res.send(result);
    } else {
      next(new HttpError(404, `Team (${req.params.id}) was not found!`));
    }
  } catch (e) {
    next(new UnexpectedError(e));
  }
});

//delete team by id
router.delete(`/${ROUTE_TEAMS}/:id`, async function (req, res, next) {
  try {
    const result = await Team.findOneAndDelete({
      _id: req.params.id,
      members: { $elemMatch: { user: req.auth.payload.sub, role: "owner" } },
    });
    if (result) {
      res.send(result);
    } else {
      next(new HttpError(404, `Team (${req.params.id}) was not found!`));
    }
  } catch (e) {
    next(new UnexpectedError(e));
  }
});

export default router;
