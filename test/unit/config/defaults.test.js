const defaults = require('~defaults');

const NUMBER_OF_CONSTANTS = 7;

describe('environment default values', () => {
  it('all neccessary values', done => {
    Object.keys(defaults).length.should.be.equals(NUMBER_OF_CONSTANTS);
    defaults.mode.should.be.an('string').that.is.not.empty;
    defaults.logLevel.should.be.an('string').that.is.not.empty;
    defaults.logFolder.should.be.an('string').that.is.not.empty;
    defaults.port.should.be.an('number');
    defaults.mongoUrl.should.be.an('string').that.is.not.empty;
    defaults.ipAddress.should.be.an('string').that.is.not.empty;
    defaults.googleApiKeysUrl.should.be.an('string').that.is.not.empty;
    done();
  });
});
