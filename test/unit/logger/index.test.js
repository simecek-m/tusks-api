const sinon = require("sinon");
const { loggers } = require("winston");
const { deleteModuleCache } = require("~test-helper/index");
const { MAIN_LOGGER } = require("~constants/logger");
const chai = require("chai");
chai.should();

describe("logger", () => {
  it("should get main logger", (done) => {
    deleteModuleCache("~logger");
    const getLoggerSpy = sinon.spy(loggers, "get");
    const logger = require("~logger");
    logger.should.exist.and.be.an("object");
    getLoggerSpy.callCount.should.be.equals(1);
    getLoggerSpy.firstCall.args[0].should.be.equals(MAIN_LOGGER);
    done();
  });
});
