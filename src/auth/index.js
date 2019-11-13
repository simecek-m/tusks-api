const logger = require('~logger');
const jwt = require('jsonwebtoken');
const { getGooglePublicKeys } = require('~auth/google');

const AUTHORIZATION_HEADER = 'authorization';
const GOOGLE_ISSUER = 'accounts.google.com';

const HTTP_STATUS_FORBIDDEN = 403;
const HTTP_STATUS_UNAUTHORIZED = 401;

const MESSAGE_NO_PAYLOAD = 'JWT has no payload!';
const MESSAGE_WRONG_ISSUER = `Issuer of the JWT is not ${GOOGLE_ISSUER}. Verification denied!`;
const MESSAGE_JWT_NOT_DECODED = 'Authorization token could not be decoded!';
const MESSAGE_GOOGLE_KEY_NOT_FOUND = 'No Google public key was found for verify signature! Verification denied!';
const MESSAGE_NO_EMAIL_FIELD = 'JWT payload has no email field.';
const MESSAGE_WRONG_FORMAT = 'Authorization header is missing or has wrong format. Required \'Authorization\': \'Bearer {TOKEN}\'!';

function authenticate (req, res, next) {
  logger.info('Verifying JWT authorization token.');
  const authorizationHeader = req.header(AUTHORIZATION_HEADER);
  const googlePublicKeys = getGooglePublicKeys();
  if (authorizationHeader && authorizationHeader.includes('Bearer ')) {
    const token = authorizationHeader.slice(7);
    const tokenDecoded = jwt.decode(token, { complete: true });
    if (!tokenDecoded) {
      next({
        status: HTTP_STATUS_UNAUTHORIZED,
        message: MESSAGE_JWT_NOT_DECODED
      });
    }
    else if (!tokenDecoded.payload) {
      next({
        status: HTTP_STATUS_UNAUTHORIZED,
        message: MESSAGE_NO_PAYLOAD
      });
    } else if (tokenDecoded.payload.iss != GOOGLE_ISSUER) {
      next({
        status: HTTP_STATUS_UNAUTHORIZED,
        message: MESSAGE_WRONG_ISSUER
      });
    } else if (!tokenDecoded.payload.email) {
      next({
        status: HTTP_STATUS_UNAUTHORIZED,
        message: MESSAGE_NO_EMAIL_FIELD
      });
    } else if (!googlePublicKeys || !googlePublicKeys.hasOwnProperty(tokenDecoded.header.kid)) {
      next({
        status: HTTP_STATUS_UNAUTHORIZED,
        message: MESSAGE_GOOGLE_KEY_NOT_FOUND
      });
    } else {
      const payload = jwt.verify(
        token,
        googlePublicKeys[tokenDecoded.header.kid],
        { algorithms: ['RS256']}
      );
      logger.info(`JWT token was successfully verified. User: ${payload.email}`);
      req.locals = payload.email;
      next();
    }
  } else {
    next({
      status: HTTP_STATUS_FORBIDDEN,
      message: MESSAGE_WRONG_FORMAT
    });
  }
}

module.exports = {
  authenticate,
  HTTP_STATUS_UNAUTHORIZED,
  HTTP_STATUS_FORBIDDEN,
  AUTHORIZATION_HEADER,
  GOOGLE_ISSUER,
  MESSAGE_NO_PAYLOAD,
  MESSAGE_WRONG_ISSUER,
  MESSAGE_JWT_NOT_DECODED,
  MESSAGE_GOOGLE_KEY_NOT_FOUND,
  MESSAGE_NO_EMAIL_FIELD,
  MESSAGE_WRONG_FORMAT
};
