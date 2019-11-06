const logger = require('~logger');
const jwt = require('jsonwebtoken');
const { getGooglePublicKeys } = require('~auth/google');

const HTTP_STATUS_UNAUTHORIZED = 401;
const HTTP_STATUS_FORBIDDEN = 403;
const AUTHORIZATION_HEADER = 'authorization';
const GOOGLE_ISSUER = 'accounts.google.com';

function decode (req, res, next) {
  logger.info('Verifying JWT authorization token.');
  const authorizationHeader = req.header(AUTHORIZATION_HEADER);
  const googlePublicKeys = getGooglePublicKeys();
  if (authorizationHeader && authorizationHeader.includes('Bearer ')) {
    const token = authorizationHeader.slice(7);
    const tokenDecoded = jwt.decode(token, { complete: true });
    if (!tokenDecoded) {
      next({
        status: HTTP_STATUS_UNAUTHORIZED,
        message: `Authorization token: ${token} could not be decoded!`
      });
    }
    else if (!tokenDecoded.payload) {
      next({
        status: HTTP_STATUS_UNAUTHORIZED,
        message: 'JWT has no payload!'
      });
    } else if (tokenDecoded.payload.iss != GOOGLE_ISSUER) {
      next({
        status: HTTP_STATUS_UNAUTHORIZED,
        message: `Issuer of the JWT is not ${GOOGLE_ISSUER}. Verification denied!`
      });
    } else if (!googlePublicKeys.hasOwnProperty(tokenDecoded.header.kid)) {
      next({
        status: HTTP_STATUS_UNAUTHORIZED,
        message: 'No Google public key for verify signature! Verification denied!'
      });
    } else {
      const payload = jwt.verify(
        token,
        googlePublicKeys[tokenDecoded.header.kid],
        { algorithms: ['RS256']}
      );
      if (payload.email) {
        logger.info(`JWT token was successfully verified. User: ${payload.email}`);
        req.locals = payload.email;
        next();
      } else {
        next({
          status: HTTP_STATUS_UNAUTHORIZED,
          message: 'JWT payload has no email field.'
        });
      }
    }
  } else {
    next({
      status: HTTP_STATUS_FORBIDDEN,
      message: 'Authorization header is missing or has wrong format. Required \'Authorization:\': \'Bearer {TOKEN}\'!'
    });
  }
}

module.exports = decode;
