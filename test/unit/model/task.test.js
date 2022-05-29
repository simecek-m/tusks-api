const mongoose = require("mongoose");
const sinon = require("sinon");
const chai = require("chai");
const { deleteModuleCache, deleteMongooseModel } = require("~test-helper");

chai.should();

const TASK_FIELDS = ["text", "completed"];

describe("task model", () => {
  it("should create schema for task model", (done) => {
    deleteMongooseModel("task");
    deleteModuleCache("~model/task");
    const mongooseSchemaSpy = sinon.spy(mongoose, "Schema");
    const mongooseModelSpy = sinon.spy(mongoose, "model");
    require("~model/task");
    mongooseSchemaSpy.callCount.should.be.equals(1);
    const firstArgument = mongooseSchemaSpy.firstCall.args[0];
    firstArgument.should.be.an("object");
    Object.keys(firstArgument).should.be.eql(TASK_FIELDS);
    mongooseModelSpy.callCount.should.be.equals(1);
    mongooseModelSpy.firstCall.args[0].should.be
      .an("string")
      .that.is.equals("task");
    mongooseModelSpy.firstCall.args[1].should.be.an("object");
    mongooseSchemaSpy.restore();
    mongooseModelSpy.restore();
    done();
  });
});
