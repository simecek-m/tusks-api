const sinon = require('sinon');
const errorHandler = require('~middleware/error');
const middleware = require('~mocks/middleware');
const chai = require('chai');
chai.should();

const TEST_ERROR = {
  status: 404,
  message: 'Page Not Found!'
};

describe('error middleware', () => {
  it('should return error object in response', done => {
    const response = middleware.response;
    const responseMock = sinon.mock(response);
    responseMock.expects('status').once().withArgs(TEST_ERROR.status).returns(response);
    responseMock.expects('send').once().withArgs(TEST_ERROR);
    const nextMiddlewareSpy = sinon.spy(middleware, 'next');
    errorHandler(TEST_ERROR, {}, response, middleware.next);
    responseMock.verify();
    nextMiddlewareSpy.callCount.should.be.equals(1);
    done();
  });
});
