import Tag from "database/model/tag";
import tagSchema from "dto/schema/tag";
import { HttpError } from "error/HttpError";
import { UnexpectedError } from "error/UnexpectedError";
import { Router } from "express";
import { validate } from "middleware/validation/validate";

const router = Router();

// get all tags
router.get("/tags", function (req, res, next) {
  Tag.find({ owner: req.auth.payload.sub })
    .then((data) => res.send(data))
    .catch((e) => next(new UnexpectedError(e)));
});

router.post("/tags", validate(tagSchema), function (req, res, next) {
  Tag.create({ owner: req.auth.payload.sub, ...req.body })
    .then((data) => res.send(data))
    .catch((e) => {
      if (e.code === 11000) {
        next(new HttpError(409, "Tag already exists!"));
      } else {
        next(new UnexpectedError(e));
      }
    });
});

router.delete("/tags/:id", function (req, res, next) {
  Tag.findOneAndDelete({ owner: req.auth.payload.sub, _id: req.params.id })
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
