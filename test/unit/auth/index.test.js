const sinon = require('sinon');
const auth = require('~auth');
const middleware = require('~mocks/middleware');

describe('auth middleware - check request header', () => {

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
  });

});
