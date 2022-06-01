const express = require("express");
const router = express.Router();

// models
const List = require("~model/list");

// get all todo lists
router.get("/lists", function (req, res, next) {
  List.find({ author: req.auth.payload.sub })
    .then((data) => res.send(data))
    .catch(next);
});

// create new todo list
router.post("/lists", function (req, res, next) {
  List.create({
    title: req.body.title,
    icon: req.body.icon,
    author: req.auth.payload.sub,
  })
    .then((data) => res.send(data))
    .catch(next);
});

// get specific todo list
router.get("/lists/:id", function (req, res, next) {
  List.findOne({ author: req.auth.payload.sub, _id: req.params.id })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        next({
          status: 404,
          message: `Todo list with id ${req.params.id} was not found!`,
        });
      }
    })
    .catch(next);
});

// update todo list
router.put("/lists/:id", function (req, res, next) {
  List.findOneAndUpdate(
    { author: req.auth.payload.sub, _id: req.params.id },
    req.body,
    {
      new: true,
    }
  )
    .then((data) => res.send(data))
    .catch(next);
});

// delete todo list
router.delete("/lists/:id", function (req, res, next) {
  List.findOneAndDelete({ author: req.auth.payload.sub, _id: req.params.id })
    .then((data) => res.send(data))
    .catch(next);
});

module.exports = router;
