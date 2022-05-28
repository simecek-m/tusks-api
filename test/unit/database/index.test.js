const sinon = require('sinon');
const database = require('~database');
const mongoose = require('mongoose');

describe('database', () => {

  it('should open database connection', async () => {
    const openConnectionMock = sinon.mock(mongoose);
    openConnectionMock.expects('connect').once().withArgs(process.env.MONGO_URL, database.OPTIONS);
    await database.connect();
    openConnectionMock.verify();
  });

  it('should close database connection', async () => {
    const closeConnectionMock = sinon.mock(mongoose);
    closeConnectionMock.expects('disconnect').once();
    await database.disconnect();
    closeConnectionMock.verify();
  });
  
});
