const chai = require('chai');
const server = require('~server');
const logger = require('~logger');
const http = require('http');
const sinon = require('sinon');
const database = require('~database');

chai.should();

describe('HTTP server', () => {

  before(async () => {
    try {
      await server.close();
    } catch (e) {
      logger.warn(e);
    }
  });

  after(async () => {
    try {
      await server.close();
    } catch (e) {
      logger.warn(e);
    }
  });

  it('should start HTTP server', async () => {
    const app = {};
    const httpCreateServerSpy = sinon.spy(http, 'createServer');
    const databaseSpy = sinon.spy(database, 'connect');
    await server.start(app);
    httpCreateServerSpy.callCount.should.be.equals(1);
    httpCreateServerSpy.firstCall.args[0].should.be.eql(app);
    databaseSpy.callCount.should.be.equals(1);
  });

  it('should stop HTTP server', async () => {
    const closeServerSpy = sinon.spy(server.connection, 'close');
    const disconnectDatabaseSpy = sinon.spy(database, 'disconnect');
    await server.close();
    closeServerSpy.callCount.should.be.equals(1);
    disconnectDatabaseSpy.callCount.should.be.equals(1);
  });
  
});
