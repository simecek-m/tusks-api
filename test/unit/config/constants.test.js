const constants = require('~constants');
const chai = require('chai');
chai.should();

const NUMBER_OF_CONSTANTS = 1;

describe('environment constants', () => {
  it('logger name', done => {
    Object.keys(constants).length.should.be.equals(NUMBER_OF_CONSTANTS);
    constants.MAIN_LOGGER.should.be.an('string').that.is.not.empty;
    done();
  });
});
