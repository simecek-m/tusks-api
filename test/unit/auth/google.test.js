const sinon = require('sinon');
const axios = require('axios');
const chai = require('chai');
const google = require('~auth/google');
const { googleApiKeysUrl } = require('~config');

const should = chai.should();

describe('authentication middleware', () => {
  it('load google public keys for verify JWT signature', async () => {
    const axiosGetMethodSpy = sinon.spy(axios, 'get');
    let result = google.getGooglePublicKeys();
    should.not.exist(result);
    await google.fetchGooglePublickKeys();
    axiosGetMethodSpy.calledOnceWith(googleApiKeysUrl).should.be.true;
    result = google.getGooglePublicKeys();
    result.should.be.an('object');
  });
});
