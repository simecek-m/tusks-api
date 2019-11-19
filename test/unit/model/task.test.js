const mongoose = require('mongoose');
const sinon = require('sinon');
const chai = require('chai');

chai.should();

const TASK_FIELDS = ['text', 'completed'];

//TODO: fix Schema wrapper
describe.skip('task model', () => {
  it('create schema for task model', done => {
    const mongooseSchemaSpy = sinon.spy(mongoose, 'Schema');
    require('~model/task');
    const firstArgument = mongooseSchemaSpy.firstCall.args[0];
    firstArgument.should.be.an('object');
    Object.keys(firstArgument).should.be.eql(TASK_FIELDS);
    sinon.restore();
    done();
  });
});
