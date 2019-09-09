const logger = require('~logger');
const jwt = require('jsonwebtoken');
const { getGooglePublicKeys } = require('~auth/google');

const AUTHORIZATION_HEADER = 'authorization';
const GOOGLE_ISSUER = 'accounts.google.com';

function decode (req, res, next) {
  logger.info('Verifying JWT authorization token.');
  const bearer = req.header(AUTHORIZATION_HEADER);
  const googlePublicKeys = getGooglePublicKeys();
  if (bearer) {
    const token = bearer.slice(7);
    const tokenDecoded = jwt.decode(token, { complete: true });
    if (tokenDecoded.payload.iss != GOOGLE_ISSUER) {
      next({
        status: 401,
        message: `Issuer of the JWT is not ${GOOGLE_ISSUER}. Verification denied!`
      });
    } else if (!googlePublicKeys.hasOwnProperty(tokenDecoded.header.kid)) {
      next({
        status: 401,
        message: 'No Google public key for verify signature! Verification denied!'
      });
    } else {
      const payload = jwt.verify(
        token,
        googlePublicKeys[tokenDecoded.header.kid],
        { algorithms: ['RS256']}
      );
      logger.info(`JWT token was successfully verified. User: ${payload.email}`);
      next();
    }
  } else {
    next({
      status: 401,
      message: 'Authorization header (bearer token) is missing in the request!'
    });
  }
}

module.exports = decode;
