// imports
import { checkJwt } from "auth";
import { Router } from "express";
const router = Router();

// routes
import statsRoutes from "router/routes/stats";
import tagsRoutes from "router/routes/tags";
import notebooksRoutes from "router/routes/notebooks";
import tasksRoutes from "router/routes/tasks";
import teamsRoutes from "router/routes/teams";

// authentication middleware
router.use(checkJwt);

// router middleware
router.use(statsRoutes);
router.use(tagsRoutes);
router.use(notebooksRoutes);
router.use(tasksRoutes);
router.use(teamsRoutes);

export default router;
