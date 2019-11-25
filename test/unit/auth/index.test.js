const sinon = require('sinon');
const auth = require('~auth');
const middleware = require('~mocks/middleware');
const createJwt = require('~test-helper/jwt/createJwt');
const chai = require('chai');
const jsonwebtoken = require('jsonwebtoken');
const googleKeys = require('~auth/google');
chai.should();

const TEST_EMAIL = 'todo@todo.com';
const TEST_GOOGLE_KEY_ID = 'db02ab30e0b75b8ecd4f816bb9e1978f62849894';

describe('auth middleware - check authorization header', () => {

  it('should return 403 - wrong format (NO TOKEN)', done => {
    const req = middleware.request;
    const mockRequest = sinon.mock(req);
    mockRequest.expects('header').once().withArgs('authorization').returns(null);
    const mockMiddleware = sinon.mock(middleware);
    mockMiddleware.expects('next').once().withArgs({ message: auth.MESSAGE_WRONG_FORMAT, status: auth.HTTP_STATUS_FORBIDDEN });
    auth.authenticate(req, {}, middleware.next);
    mockRequest.verify();
    mockMiddleware.verify();
    done();
  });

  it('should return 403 - wrong format (BAD FORMAT)', done => {
    const req = middleware.request;
    const mockRequest = sinon.mock(req);
    mockRequest.expects('header').once().withArgs('authorization').returns('TOKEN');
    const mockMiddleware = sinon.mock(middleware);
    mockMiddleware.expects('next').once().withArgs({ message: auth.MESSAGE_WRONG_FORMAT, status: auth.HTTP_STATUS_FORBIDDEN });
    auth.authenticate(req, {}, middleware.next);
    mockRequest.verify();
    mockMiddleware.verify();
    done();
  });

  it('should return 401 - JWT not decoded', done => {
    const TOKEN = 'Bearer TOKEN';
    const req = middleware.request;
    const mockRequest = sinon.mock(req);
    mockRequest.expects('header').once().withArgs('authorization').returns(TOKEN);
    const mockMiddleware = sinon.mock(middleware);
    mockMiddleware.expects('next').once().withArgs({ message: auth.MESSAGE_JWT_NOT_DECODED, status: auth.HTTP_STATUS_UNAUTHORIZED });
    auth.authenticate(req, {}, middleware.next);
    mockRequest.verify();
    mockMiddleware.verify();
    done();
  });

  it('should return 401 - wrong issuer', done => {
    const jwt = createJwt();
    const token = `Bearer ${jwt}`;
    const req = middleware.request;
    const mockRequest = sinon.mock(req);
    mockRequest.expects('header').once().withArgs('authorization').returns(token);
    const mockMiddleware = sinon.mock(middleware);
    mockMiddleware.expects('next').once().withArgs({ message: auth.MESSAGE_WRONG_ISSUER, status: auth.HTTP_STATUS_UNAUTHORIZED });
    auth.authenticate(req, {}, middleware.next);
    mockRequest.verify();
    mockMiddleware.verify();
    done();
  });

  it('should return 401 - missing email', done => {
    const jwt = createJwt({ iss: auth.GOOGLE_ISSUER });
    const token = `Bearer ${jwt}`;
    const req = middleware.request;
    const mockRequest = sinon.mock(req);
    mockRequest.expects('header').once().withArgs('authorization').returns(token);
    const mockMiddleware = sinon.mock(middleware);
    mockMiddleware.expects('next').once().withArgs({ message: auth.MESSAGE_NO_EMAIL_FIELD, status: auth.HTTP_STATUS_UNAUTHORIZED });
    auth.authenticate(req, {}, middleware.next);
    mockRequest.verify();
    mockMiddleware.verify();
    done();
  });

  it('should return 401 - missing key identifier (kid)', done => {
    const jwt = createJwt({ iss: auth.GOOGLE_ISSUER, email: TEST_EMAIL });
    const token = `Bearer ${jwt}`;
    const req = middleware.request;
    const mockRequest = sinon.mock(req);
    mockRequest.expects('header').once().withArgs('authorization').returns(token);
    const mockMiddleware = sinon.mock(middleware);
    mockMiddleware.expects('next').once().withArgs({ message: auth.MESSAGE_GOOGLE_KEY_NOT_FOUND, status: auth.HTTP_STATUS_UNAUTHORIZED });
    auth.authenticate(req, {}, middleware.next);
    mockRequest.verify();
    mockMiddleware.verify();
    done();
  });

  it('should verify correctly', done => {
    const jwt = createJwt({ iss: auth.GOOGLE_ISSUER, email: TEST_EMAIL }, 'SECRET', { header: { kid: TEST_GOOGLE_KEY_ID }});
    const token = `Bearer ${jwt}`;
    const req = middleware.request;
    const mockRequest = sinon.mock(req);
    mockRequest.expects('header').once().withArgs('authorization').returns(token);
    const mockGoogleKeys = sinon.mock(googleKeys);
    mockGoogleKeys.expects('getGooglePublicKeys').once().returns({ [TEST_GOOGLE_KEY_ID]: 'TEST' });
    const mockVerify = sinon.mock(jsonwebtoken);
    mockVerify.expects('verify').once().returns({ email: TEST_EMAIL });
    auth.authenticate(req, {}, middleware.next);
    mockGoogleKeys.verify();
    mockRequest.verify();
    mockVerify.verify();
    sinon.restore();
    done();
  });

});
