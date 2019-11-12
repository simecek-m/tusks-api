const defaults = require('~defaults');

const NUMBER_OF_CONSTANTS = 7;

describe('environment default values', () => {
  it('all neccessary values', done => {
    Object.keys(defaults).length.should.be.equals(NUMBER_OF_CONSTANTS);
    defaults.MODE.should.exist.and.be.an('string').that.is.not.empty;
    defaults.LOG_LEVEL.should.exist.and.be.an('string').that.is.not.empty;
    defaults.LOG_FOLDER.should.exist.and.be.an('string').that.is.not.empty;
    defaults.PORT.should.exist.and.be.an('number');
    defaults.MONGO_URL.should.exist.and.be.an('string').that.is.not.empty;
    defaults.IP_ADDRESS.should.exist.and.be.an('string').that.is.not.empty;
    defaults.GOOGLE_API_KEYS_URL.should.exist.and.be.an('string').that.is.not.empty;
    done();
  });
});
