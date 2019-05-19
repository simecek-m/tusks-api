// imports
const express = require('express');
const router = express.Router();

// routes
const todos = require('./routes/todo');
const tasks = require('./routes/task');

// router middleware
router.use(todos);
router.use(tasks);

module.exports = router;