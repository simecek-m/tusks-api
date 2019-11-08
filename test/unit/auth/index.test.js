const sinon = require('sinon');
const auth = require('~auth');
const middleware = require('~mocks/middleware');

describe('auth middleware - check authorization header', () => {

  it('request without authorization header', () => {
    const authenticateSpy = sinon.spy(auth, 'authenticate');
    const req = middleware.request;
    const mockRequest = sinon.mock(req);
    mockRequest.expects('header').once().withArgs('authorization').returns(null);
    const mockMiddleware = sinon.mock(middleware);
    mockMiddleware.expects('next').once().withArgs({ message: auth.MESSAGE_WRONG_FORMAT, status: auth.HTTP_STATUS_FORBIDDEN });
    auth.authenticate(req, {}, middleware.next);
    authenticateSpy.calledOnce.should.be.true;
    mockRequest.verify();
    mockMiddleware.verify();
    authenticateSpy.restore();
  });

  it('request with authorization header with bad format', () => {
    const authenticateSpy = sinon.spy(auth, 'authenticate');
    const req = middleware.request;
    const mockRequest = sinon.mock(req);
    mockRequest.expects('header').once().withArgs('authorization').returns('TOKEN');
    const mockMiddleware = sinon.mock(middleware);
    mockMiddleware.expects('next').once().withArgs({ message: auth.MESSAGE_WRONG_FORMAT, status: auth.HTTP_STATUS_FORBIDDEN });
    auth.authenticate(req, {}, middleware.next);
    authenticateSpy.calledOnce.should.be.true;
    mockRequest.verify();
    mockMiddleware.verify();
    authenticateSpy.restore();
  });

  it('request with authorization header with undecodable token', () => {
    const TOKEN = 'Bearer TOKEN';
    const authenticateSpy = sinon.spy(auth, 'authenticate');
    const req = middleware.request;
    const mockRequest = sinon.mock(req);
    mockRequest.expects('header').once().withArgs('authorization').returns(TOKEN);
    const mockMiddleware = sinon.mock(middleware);
    mockMiddleware.expects('next').once().withArgs({ message: auth.MESSAGE_JWT_NOT_DECODED, status: auth.HTTP_STATUS_UNAUTHORIZED });
    auth.authenticate(req, {}, middleware.next);
    authenticateSpy.calledOnce.should.be.true;
    mockRequest.verify();
    mockMiddleware.verify();
    authenticateSpy.restore();
  });

});
