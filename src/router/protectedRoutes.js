// imports
const express = require("express");
const router = express.Router();

// routes
const listsRoutes = require("~router/routes/lists");
const tasksRoutes = require("~router/routes/tasks");
const statsRoutes = require("~router/routes/stats");
const tagsRoutes = require("~router/routes/tags");

// router middleware
router.use(listsRoutes);
router.use(tasksRoutes);
router.use(statsRoutes);
router.use(tagsRoutes);

module.exports = router;
