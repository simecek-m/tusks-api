const mongoose = require('mongoose');
const sinon = require('sinon');
const chai = require('chai');

chai.should();

const TODO_FIELDS = ['title', 'tasks', 'author'];

describe('todo model', () => {
  it('create schema for todo model', done => {
    const mongooseSchemaSpy = sinon.spy(mongoose, 'Schema');
    require('~model/todo');
    const firstArgument = mongooseSchemaSpy.firstCall.args[0];
    firstArgument.should.be.an('object');
    Object.keys(firstArgument).should.be.eql(TODO_FIELDS);
    sinon.restore();
    done();
  });
});
