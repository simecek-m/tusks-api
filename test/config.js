const fs = require('fs').promises;
const colors = require('colors');
const chai = require('chai');

chai.should();

// constants sets as env variables
const envVariables = {
  mode: 'test-config',
  port: '4444',
  mongoDb: 'mongodb://127.0.0.1/test'
};

// function for setting new env variables 
function setEnvironmentVariables () {
  process.env.MODE = envVariables.mode;
  process.env.PORT = envVariables.port;
  process.env.DB_MONGO = envVariables.mongoDb;
}

describe('config without .test.env file', () => {
  
  before(async () => {
    // delete cached config module containing env variables 
    delete require.cache[require.resolve('../config')];

    // rename original .test.env file if exists
    try {
      await fs.rename('./config/.test.env', './config/.original.test.env.');
    } catch (error) {
      console.log(colors.blue('error while renaming original .test.env file'));
      console.log(error.message);
    }

    // set new env variables
    setEnvironmentVariables();
  });

  after(async () => {

    // rename back original .test.env file
    try {
      await fs.rename('./config/.original.test.env.', './config/.test.env');
    } catch (error) {
      console.log(colors.blue('error while renaming back .test.env file'));
      console.log(error.message);
    }
  });
  
  it('should set environment variables from process.env', () => {
    const config = require('~config');
    config.should.be.eql(envVariables);
  });
});
