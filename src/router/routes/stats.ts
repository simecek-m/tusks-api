import { ROUTE_STATS } from "constant";
import Project from "database/model/Project";
import { UnexpectedError } from "error/UnexpectedError";
import { Router } from "express";

const router = Router();

router.get(`/${ROUTE_STATS}`, async function (req, res, next) {
  try {
    const projects = await Project.find({ author: req.auth.payload.sub })
      .populate("tags")
      .sort({
        updatedAt: -1,
      });
    const lastActiveProject = projects[0] ?? null;
    const projectsCount = projects.length;
    const unfinishedTasksCount = projects.reduce(
      (prev, curr) =>
        prev + curr.tasks.filter((task) => !task.isCompleted).length,
      0
    );
    res.send({ lastActiveProject, projectsCount, unfinishedTasksCount });
  } catch (e) {
    next(new UnexpectedError(e));
  }
});

export default router;
