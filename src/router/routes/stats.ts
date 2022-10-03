import { ROUTE_STATS } from "constant";
import Notebook from "database/model/Notebook";
import { UnexpectedError } from "error/UnexpectedError";
import { Router } from "express";

const router = Router();

router.get(`/${ROUTE_STATS}`, async function (req, res, next) {
  try {
    const notebooks = await Notebook.find({ author: req.auth.payload.sub })
      .populate("tags")
      .sort({
        updatedAt: -1,
      });
    const lastActive = notebooks[0] ?? null;
    const notebooksCount = notebooks.length;
    const unfinishedTasksCount = notebooks.reduce(
      (prev, curr) =>
        prev + curr.tasks.filter((task) => !task.isCompleted).length,
      0
    );
    res.send({ lastActive, notebooksCount, unfinishedTasksCount });
  } catch (e) {
    next(new UnexpectedError(e));
  }
});

export default router;
