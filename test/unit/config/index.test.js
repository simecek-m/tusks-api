const chai = require('chai');
const sinon = require('sinon');
const dotenv = require('dotenv');
const { restoreTestEnvVariables, deleteModuleCache } = require('~test-helper');
chai.should();

const TEST_ENVIRONMENT_VARIABLES = {
  MODE:'mode',
  LOG_LEVEL:'logLevel',
  LOG_FOLDER:'logFolder',
  PORT:4200,
  IP_ADDRESS:'ipAddress',
  MONGO_URL:'mongodb',
  GOOGLE_API_KEYS_URL:'googleUrl'
};

beforeEach (done => {
  restoreTestEnvVariables();
  deleteModuleCache('~config');
  done();
});

describe('setup config variables', () => {

  it('load config from dotenv file', done => {
    sinon.replace(dotenv, 'config', () => {
      process.env = { ...TEST_ENVIRONMENT_VARIABLES };
      return {
        parsed: { ...TEST_ENVIRONMENT_VARIABLES }
      };
    });
    const config = require('~config');
    Object.keys(config).length.should.be.equals(Object.keys(TEST_ENVIRONMENT_VARIABLES).length);
    config.should.be.eql(TEST_ENVIRONMENT_VARIABLES);
    sinon.restore();
    done();
  });

});
