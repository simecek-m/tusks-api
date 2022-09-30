// imports
import { checkJwt } from "auth";
import { Router } from "express";
const router = Router();

// authentication middleware
router.use(checkJwt);

// routes
import statsRoutes from "router/routes/stats";
import tagsRoutes from "router/routes/tags";
import listsRoutes from "router/routes/lists";
import tasksRoutes from "router/routes/tasks";

// router middleware
router.use(statsRoutes);
router.use(tagsRoutes);
router.use(listsRoutes);
router.use(tasksRoutes);

export default router;
