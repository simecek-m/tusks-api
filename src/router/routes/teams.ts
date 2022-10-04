import { ROUTE_TEAMS } from "constant";
import Team from "database/model/Team";
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

export default router;
