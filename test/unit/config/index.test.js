const chai = require('chai');
const sinon = require('sinon');
const dotenv = require('dotenv');
const defaults = require('~defaults');
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

const PARTIAL_TEST_ENVIRONMENT_VARIABLES = {
  LOG_LEVEL:'logLevel',
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

  it('should load config from dotenv file', done => {
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

  it('should use defaults as config variables - missing .env file', done => {
    sinon.replace(dotenv, 'config', () => {
      process.env = {  };
      return {
        parsed: { }
      };
    });
    const config = require('~config');
    Object.keys(config).length.should.be.equals(Object.keys(defaults).length);
    config.should.be.eql(defaults);
    sinon.restore();
    done();
  });

  it('should use mix of defaults and dotenv file - missing values in .env file', done => {
    sinon.replace(dotenv, 'config', () => {
      process.env = { ...PARTIAL_TEST_ENVIRONMENT_VARIABLES };
      return {
        parsed: { ...PARTIAL_TEST_ENVIRONMENT_VARIABLES }
      };
    });
    const config = require('~config');
    const mergedObject = { ...defaults, ...PARTIAL_TEST_ENVIRONMENT_VARIABLES };
    Object.keys(config).length.should.be.equals(Object.keys(mergedObject).length);
    config.should.be.eql(mergedObject);
    sinon.restore();
    done();
  });

});
