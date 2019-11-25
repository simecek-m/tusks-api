const app = require('~app');
const sinon = require('sinon');
const chai = require('chai');
const googleApi = require('~auth/google');
const httpServer = require('~server');

chai.should();

describe('application', () => {
  
  it('should start application', async () => {
    const googleApiSpy = sinon.spy(googleApi, 'fetchGooglePublickKeys');
    const httpServerSpy = sinon.spy(httpServer, 'start');
    await app.start();
    googleApiSpy.callCount.should.be.equals(1);
    httpServerSpy.callCount.should.be.equals(1);
    googleApiSpy.restore();
    httpServerSpy.restore();
  });
  
  it('should stop application', async () => {
    const httpServerSpy = sinon.spy(httpServer, 'close');
    await app.stop();
    httpServerSpy.callCount.should.be.equals(1);
    httpServerSpy.restore();
  });

});
