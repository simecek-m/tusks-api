import { ROUTE_STATS } from "constant";
import List from "database/model/list";
import { UnexpectedError } from "error/UnexpectedError";
import { Router } from "express";

const router = Router();

router.get(`/${ROUTE_STATS}`, async function (req, res, next) {
  try {
    const lists = await List.find({ author: req.auth.payload.sub })
      .populate("tags")
      .sort({
        updatedAt: -1,
      });
    const lastActiveList = lists[0] ?? null;
    const listsCount = lists.length;
    const unfinishedTasksCount = lists.reduce(
      (prev, curr) =>
        prev + curr.tasks.filter((task) => !task.isCompleted).length,
      0
    );
    res.send({ listsCount, unfinishedTasksCount, lastActiveList });
  } catch (e) {
    next(new UnexpectedError(e));
  }
});

export default router;
