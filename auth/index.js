const { googleJwtSignatureSecret } = require('~config');
const logger = require('~logger');
const jwt = require('jsonwebtoken');
const AUTHORIZATION_HEADER = 'authorization';
const BASE64_ENCODING = 'base64';

function decode (req, res, next) {  
  const token = req.header(AUTHORIZATION_HEADER);
  logger.info('Verifying JWT authorization token.');
  const payload = jwt.verify(token.slice(7), Buffer.from(googleJwtSignatureSecret, BASE64_ENCODING));
  logger.info(`JWT token was successfully verified. Payload: ${JSON.stringify(payload)}`);
  next();
}

module.exports = decode;
