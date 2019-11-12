// default values for environment variables
const defaults = {
  MODE: 'dev',
  LOG_LEVEL: 'debug',
  LOG_FOLDER: 'logs',
  PORT: 8080,
  MONGO_URL: 'mongodb://localhost/todo-db',
  IP_ADDRESS: 'localhost',
  GOOGLE_API_KEYS_URL: 'https://www.googleapis.com/oauth2/v1/certs'
};

module.exports = defaults;
