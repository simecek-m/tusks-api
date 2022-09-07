import { Router } from "express";
const router = Router();

// models
import Tag from "database/model/tag";

// get all tags
router.get("/tags", function (req, res, next) {
  Tag.find({ owner: req.auth.payload.sub })
    .then((data) => res.send(data))
    .catch(next);
});

router.post("/tags", function (req, res, next) {
  Tag.create({ owner: req.auth.payload.sub, ...req.body })
    .then((data) => res.send(data))
    .catch((e) => {
      if (e.code === 11000) {
        next({ status: 409, message: "Tag already exists!" });
      } else {
        next(e);
      }
    });
});

router.delete("/tags/:id", function (req, res, next) {
  Tag.findOneAndDelete({ owner: req.auth.payload.sub, _id: req.params.id })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        next({
          status: 404,
          message: `Tag (${req.params.id}) was not found!`,
        });
      }
    })
    .catch(next);
});

export default router;
