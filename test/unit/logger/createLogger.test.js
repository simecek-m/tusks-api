const sinon = require('sinon');
const { loggers } = require('winston');
const createLogger = require('~logger/createLogger');
const { MAIN_LOGGER } = require('~constants');
const chai = require('chai');
chai.should();

describe('logger - create', () => {
  it('create main logger', done => {
    const addLoggerSpy = sinon.spy(loggers, 'add');
    createLogger();
    addLoggerSpy.callCount.should.be.equals(1);
    addLoggerSpy.firstCall.args[0].should.be.equals(MAIN_LOGGER);
    done();
  });
});
