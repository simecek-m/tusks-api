// imports
import { checkJwt } from "auth";
import { Router } from "express";
const router = Router();

// routes
import statsRoutes from "router/routes/stats";
import tagsRoutes from "router/routes/tags";
import projectsRoutes from "router/routes/projects";
import teamsRoutes from "router/routes/teams";
import pagesRoutes from "router/routes/pages";
import profilesRoutes from "router/routes/profiles";

// authentication middleware
router.use(checkJwt);

// router middleware
router.use(statsRoutes);
router.use(tagsRoutes);
router.use(projectsRoutes);
router.use(teamsRoutes);
router.use(pagesRoutes);
router.use(profilesRoutes);

export default router;
