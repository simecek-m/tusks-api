const sinon = require('sinon');
const auth = require('~auth');
const middleware = require('~mocks/middleware');
const createJwt = require('~test-helper/jwt/createJwt');
const chai = require('chai');
chai.should();

const EMAIL = 'todo@todo.com';

describe('auth middleware - check authorization header', () => {

  it('no authorization header', done => {
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

  it('authorization header - bad format', done => {
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

  it('authorization header - undecodable token', done => {
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

  it('JWT - wrong issuer', done => {
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

  it('JWT - missing email in payload', done => {
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

  it('JWT - no key identifier (kid)', done => {
    const jwt = createJwt({ iss: auth.GOOGLE_ISSUER, email: EMAIL });
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

});
