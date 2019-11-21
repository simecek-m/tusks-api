const mongoose = require('mongoose');
const sinon = require('sinon');
const chai = require('chai');
const { deleteModuleCache, deleteMongooseModel } = require('~test-helper');

chai.should();

const TODO_FIELDS = ['title', 'tasks', 'author'];

describe('todo model', () => {
  it('create schema for todo model', done => {
    deleteMongooseModel('todo');
    deleteModuleCache('~model/todo');
    const mongooseSchemaSpy = sinon.spy(mongoose, 'Schema');
    const mongooseModelSpy = sinon.spy(mongoose, 'model');
    require('~model/todo');
    mongooseSchemaSpy.callCount.should.be.equals(1);
    const firstArgument = mongooseSchemaSpy.firstCall.args[0];
    firstArgument.should.be.an('object');
    Object.keys(firstArgument).should.be.eql(TODO_FIELDS);
    mongooseModelSpy.callCount.should.be.equals(1);
    mongooseModelSpy.firstCall.args[0].should.be.an('string').that.is.equals('todo');
    mongooseModelSpy.firstCall.args[1].should.be.an('object');
    mongooseSchemaSpy.restore();
    mongooseModelSpy.restore();
    done();
  });
});
