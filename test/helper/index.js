const mongoose = require("mongoose");

function restoreTestEnvVariables() {
  process.env = {
    MODE: "test",
  };
}

function deleteModuleCache(moduleName) {
  delete require.cache[require.resolve(moduleName)];
}

function deleteMongooseModel(modelName) {
  delete mongoose.connection.models[modelName];
}

module.exports = {
  restoreTestEnvVariables,
  deleteModuleCache,
  deleteMongooseModel,
};
