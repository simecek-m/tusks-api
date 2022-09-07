// imports
import { Router } from "express";
const router = Router();

// routes
import listsRoutes from "router/routes/lists";
import tasksRoutes from "router/routes/tasks";
import statsRoutes from "router/routes/stats";
import tagsRoutes from "router/routes/tags";

// router middleware
router.use(listsRoutes);
router.use(tasksRoutes);
router.use(statsRoutes);
router.use(tagsRoutes);

export default router;
