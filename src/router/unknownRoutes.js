// imports
const express = require('express');
const router = express.Router();

// unknown /api/ endpoints middleware
router.use('/api/:path?', (req, res, next) => {
  next({
    status: 404,
    message: `API endpoint ${req.originalUrl} doesn't exist`
  });
});

// rest unknown /* endpoints middleware
router.use('/', (req, res, next) => {
  next({
    status: 404,
    message: `${req.originalUrl} is not valid API endpoint. Missing /api/ prefix!`
  });
});

module.exports = router;
