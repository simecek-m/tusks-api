const sinon = require('sinon');
const axios = require('axios');
const chai = require('chai');
const { deleteModuleCache } = require('~test-helper/index');

const { GOOGLE_API_KEYS_URL } = require('~config');

const should = chai.should();

const GOOGLE_KEYS_TEST = {
  data: { 
    kid: 'TEST'
  }
};

describe('auth middleware - fetch google key for RSA', () => {
  
  it('should load google public keys for verify JWT signature', async () => {
    deleteModuleCache('~auth/google');
    const googleApi = require('~auth/google');
    const axiosMock = sinon.mock(axios);
    axiosMock.expects('get').once().withArgs(GOOGLE_API_KEYS_URL).returns(GOOGLE_KEYS_TEST);
    let result = googleApi.getGooglePublicKeys();
    should.not.exist(result);
    await googleApi.fetchGooglePublickKeys();
    result = googleApi.getGooglePublicKeys();
    result.should.be.eql(GOOGLE_KEYS_TEST.data);
    axiosMock.verify();
    axiosMock.restore();
  });
});
