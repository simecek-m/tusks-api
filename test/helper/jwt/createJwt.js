const jwt = require('jsonwebtoken');

function createJwt (payload = {}, key = 'SECRET') {
  return jwt.sign(payload, key);
}

module.exports = createJwt;
