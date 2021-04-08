// imports
const express = require('express');
const router = express.Router();

// routes
const listsRoutes = require('~router/routes/lists');
const tasksRoutes = require('~router/routes/tasks');

// router middleware
router.use(listsRoutes);
router.use(tasksRoutes);

module.exports = router;
