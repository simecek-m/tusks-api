const app = require('~app');
const sinon = require('sinon');
const chai = require('chai');
const httpServer = require('~server');

chai.should();

describe('application', () => {
  
  it('should start application', async () => {
    const httpServerSpy = sinon.spy(httpServer, 'start');
    await app.start();
    httpServerSpy.callCount.should.be.equals(1);
    httpServerSpy.restore();
  });
  
  it('should stop application', async () => {
    const httpServerSpy = sinon.spy(httpServer, 'close');
    await app.stop();
    httpServerSpy.callCount.should.be.equals(1);
    httpServerSpy.restore();
  });

});
