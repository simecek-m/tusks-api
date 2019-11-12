function deleteModuleCache (moduleName) {
  delete require.cache[require.resolve(moduleName)];
}

function restoreTestEnvVariables () {
  process.env = {
    MODE: 'test'
  };
}

module.exports = {
  restoreTestEnvVariables,
  deleteModuleCache
};
