const express = require('express');
const router = express.Router();

// get all todo lists
router.post('/authentication', function (req, res) {
  res.send({ message: 'Authentication is not implemented yet!' });
});

module.exports = router;
