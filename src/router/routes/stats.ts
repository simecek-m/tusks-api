import { Router } from "express";
import List from "database/model/list";
import { HttpError } from "error/HttpError";
import logger from "logger";

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
    logger.error("Unexpected error -> GET /stats endpoint:", e);
    next(new HttpError(500, "Unexpected error"));
  }
});

export default router;
