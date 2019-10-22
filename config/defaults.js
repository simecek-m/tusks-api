// default values for environment variables
const defaults = {
  mode: 'dev',
  logLevel: 'debug',
  port: 8080,
  mongoUrl: 'mongodb://localhost/todo-db',
  ipAddress: 'localhost',
  googleApiKeysUrl: 'https://www.googleapis.com/oauth2/v1/certs'
};

module.exports = defaults;
