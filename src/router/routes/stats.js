const express = require("express");
const router = express.Router();

// models
const List = require("~model/list");

router.get("/stats", async function (req, res, next) {
  try {
    const lists = await List.find({ author: req.auth.payload.sub }).sort({
      updatedAt: -1,
    });
    const lastActiveList = lists[0];
    const listsCount = lists.length;
    const unfinishedTasks = lists.reduce(
      (prev, curr) =>
        prev + curr.tasks.filter((task) => !task.isCompleted).length,
      0
    );

    res.send({ listsCount, unfinishedTasks, lastActiveList });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
