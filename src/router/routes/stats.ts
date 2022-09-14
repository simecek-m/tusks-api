import List from "database/model/list";
import { UnexpectedError } from "error/UnexpectedError";
import { Router } from "express";

const router = Router();

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
    next(new UnexpectedError(e));
  }
});

export default router;
