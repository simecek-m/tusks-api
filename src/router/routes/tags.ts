import { ROUTE_TAGS } from "constant";
import Tag from "database/model/Tag";
import tagSchema from "dto/schema/tag";
import { HttpError } from "error/HttpError";
import { UnexpectedError } from "error/UnexpectedError";
import { Router } from "express";
import { validate } from "middleware/validation/validate";

const router = Router();

// get all tags
router.get(`/${ROUTE_TAGS}`, function (req, res, next) {
  Tag.find({ owner: req.auth.payload.sub })
    .then((data) => res.send(data))
    .catch((e) => next(new UnexpectedError(e)));
});

router.post(`/${ROUTE_TAGS}`, validate(tagSchema), function (req, res, next) {
  Tag.create({ ...req.body, owner: req.auth.payload.sub })
    .then((data) => res.send(data))
    .catch((e) => {
      next(new UnexpectedError(e));
    });
});

router.delete(`/${ROUTE_TAGS}/:id`, function (req, res, next) {
  Tag.findOneAndDelete({ _id: req.params.id, owner: req.auth.payload.sub })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        next(new HttpError(404, `Tag (${req.params.id}) was not found!`));
      }
    })
    .catch((e) => next(new UnexpectedError(e)));
});

export default router;
