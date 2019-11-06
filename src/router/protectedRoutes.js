// imports
const express = require('express');
const router = express.Router();

// routes
const todos = require('~router/routes/todo');

// router middleware
router.use(todos);

module.exports = router;
