const mongoose = require("mongoose");
const sinon = require("sinon");
const chai = require("chai");
const { deleteModuleCache, deleteMongooseModel } = require("~test-helper");

chai.should();

const TODO_FIELDS = ["title", "tasks", "author"];

describe("todo model", () => {
  it("should create schema for todo list model", (done) => {
    deleteMongooseModel("list");
    deleteModuleCache("~model/list");
    const mongooseSchemaSpy = sinon.spy(mongoose, "Schema");
    const mongooseModelSpy = sinon.spy(mongoose, "model");
    require("~model/list");
    mongooseSchemaSpy.callCount.should.be.equals(1);
    const firstArgument = mongooseSchemaSpy.firstCall.args[0];
    firstArgument.should.be.an("object");
    Object.keys(firstArgument).should.be.eql(TODO_FIELDS);
    mongooseModelSpy.callCount.should.be.equals(1);
    mongooseModelSpy.firstCall.args[0].should.be
      .an("string")
      .that.is.equals("list");
    mongooseModelSpy.firstCall.args[1].should.be.an("object");
    mongooseSchemaSpy.restore();
    mongooseModelSpy.restore();
    done();
  });
});
