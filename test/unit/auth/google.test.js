const sinon = require('sinon');
const axios = require('axios');
const chai = require('chai');
const google = require('~auth/google');
const { GOOGLE_API_KEYS_URL } = require('~config');

const should = chai.should();

const GOOGLE_KEYS_TEST = {
  data: { 
    kid: 'TEST'
  }
};

describe('auth middleware - fetch google key for RSA', () => {
  it('load google public keys for verify JWT signature', async () => {
    const axiosMock = sinon.mock(axios);
    axiosMock.expects('get').once().withArgs(GOOGLE_API_KEYS_URL).returns(GOOGLE_KEYS_TEST);
    let result = google.getGooglePublicKeys();
    should.not.exist(result);
    await google.fetchGooglePublickKeys();
    result = google.getGooglePublicKeys();
    result.should.be.eql(GOOGLE_KEYS_TEST.data);
    axiosMock.verify();
  });
});
