import { ROUTE_PROFILES } from "constant";
import Profile from "database/model/Profile";
import profileSchema from "dto/schema/profile";
import { HttpError } from "error/HttpError";
import { UnexpectedError } from "error/UnexpectedError";
import { Router } from "express";
import { validate } from "middleware/validation/validate";
import { HttpStatus } from "constant";

const router = Router();

// retrieve profile of currently logged in user
router.get(`/${ROUTE_PROFILES}/me`, async (req, res, next) => {
  try {
    const result = await Profile.findById(req.auth.payload.sub);
    if (result) {
      res.status(HttpStatus.OK).send(result);
    } else {
      next(new HttpError(HttpStatus.NOT_FOUND, `User profile was not found!`));
    }
  } catch (e) {
    next(new UnexpectedError(e));
  }
});

// create new user profile
router.post(
  `/${ROUTE_PROFILES}`,
  validate(profileSchema),
  async (req, res, next) => {
    try {
      const result = await Profile.create({
        ...req.body,
        _id: req.auth.payload.sub,
      });
      res.status(HttpStatus.OK).send(result);
    } catch (e) {
      if (e.code === 11000) {
        next(
          new HttpError(HttpStatus.CONFLICT, "User profile already exists!")
        );
      } else {
        next(new UnexpectedError(e));
      }
    }
  }
);

// retrieve all registered profiles
router.get(`/${ROUTE_PROFILES}`, async (req, res, next) => {
  try {
    const result = await Profile.find(
      {},
      { _id: true, email: true, firstName: true, lastName: true, picture: true }
    );
    res.status(HttpStatus.OK).send(result);
  } catch (e) {
    next(new UnexpectedError(e));
  }
});

export default router;
