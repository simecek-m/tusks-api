const sinon = require('sinon');
const database = require('~database');
const mongoose = require('mongoose');
const { MONGO_URL } = require('~config');

describe('database', () => {

  it('open database connection', async () => {
    const openConnectionMock = sinon.mock(mongoose);
    openConnectionMock.expects('connect').once().withArgs(MONGO_URL, database.OPTIONS);
    await database.connect();
    openConnectionMock.verify();
  });

  it('close database connection', async () => {
    const closeConnectionMock = sinon.mock(mongoose);
    closeConnectionMock.expects('disconnect').once();
    await database.disconnect();
    closeConnectionMock.verify();
  });
  
});
