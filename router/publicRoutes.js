// imports
const express = require('express');
const router = express.Router();

// routes
const authentication = require('~router/routes/authentication');

// router middleware
router.use(authentication);

module.exports = router;
