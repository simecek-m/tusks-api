const fs = require('fs').promises;
const colors = require('colors');
const chai = require('chai');
const defaults = require('~config/defaults');

chai.should();

describe('config without .test.env file', () => {
  
  before(async () => {
    // delete cached config module 
    delete require.cache[require.resolve('../config')];

    // reset env variables 
    resetEnvironmentVariables();
    
    // rename original .test.env file if exists
    try {
      await fs.rename('./config/.test.env', './config/.original.test.env.');
      console.log('rename .test.env');
    } catch (error) {
      console.log(colors.blue('error while renaming original .test.env file'));
      console.log(error.message);
    }

  });

  after(async () => {

    // rename back original .test.env file
    try {
      await fs.rename('./config/.original.test.env.', './config/.test.env');
      console.log('rename back .test.env');
    } catch (error) {
      console.log(colors.blue('error while renaming back .test.env file'));
      console.log(error.message);
    }
  });
  
  it('should set default variables', () => {
    const config = require('~config');
    config.should.be.eql(defaults);
  });
});

function resetEnvironmentVariables () {
  delete process.env.MODE;
  delete process.env.PORT;
  delete process.env.MONGO_URL;
}
