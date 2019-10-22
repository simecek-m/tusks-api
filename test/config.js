const fs = require('fs').promises;
const chai = require('chai');
const defaults = require('~defaults');
const logger = require('~logger');

const ORIGINAL_ENV_FILE = './config/env/.dev.env';
const RENAMED_ENV_FILE = './config/env/.original.dev.env';

chai.should();

describe('config without .dev.env file', () => {
  
  before(async () => {
    // delete cached config module 
    delete require.cache[require.resolve('../config')];

    // reset env variables 
    resetEnvironmentVariables();
    
    // rename original .dev.env file if exists
    try {
      await fs.rename(ORIGINAL_ENV_FILE, RENAMED_ENV_FILE);
      logger.info('Renaming original .dev.env file.');
    } catch (error) {
      logger.warn(`Error while renaming original .dev.env file: ${error.message}!`);
    }

  });

  after(async () => {

    // rename back original .dev.env file
    try {
      await fs.rename(RENAMED_ENV_FILE, ORIGINAL_ENV_FILE);
      logger.info('Renaming back .test.env file.');
    } catch (error) {
      logger.warn(`Error while renaming back .test.env file ${error.message}!`);
    }
  });
  
  it('should set default variables', () => {
    const config = require('~config');
    config.should.be.eql(defaults);
  });
});

function resetEnvironmentVariables () {
  delete process.env.MODE;
  delete process.env.LOG_LEVEL;
  delete process.env.PORT;
  delete process.env.MONGO_URL;
  delete process.env.GOOGLE_JWT_SIGNATURE_SECRET;
}
