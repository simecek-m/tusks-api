const jwt = require('jsonwebtoken');

function createJwt (payload = {}, key = 'SECRET', options = {}) {
  return jwt.sign(payload, key, options);
}

module.exports = createJwt;
