const { IP_ADDRESS, PORT } = require('~config');
const database = require('~database');
const util = require('util');
const http = require('http');
const logger = require('~logger');

const server = {
  connection: null,
  async start (app) {
    logger.info('Starting HTTP server.');

    // create http server
    this.connection = http.createServer(app);

    // promisify listen function - use promise instead callback
    const listenPromisify = util.promisify(this.connection.listen.bind(this.connection));

    // open http server
    await listenPromisify(PORT, IP_ADDRESS);
    logger.info(`HTTP server is running on ${IP_ADDRESS}:${PORT}.`);

    // try to connect to db
    try {
      await database.connect();
      logger.info('Successfully connected to Mongo database.');
    } catch (error) {
      logger.warn(`Can't connect to Mongo database: ${error.message}!`);
    }
    return this.connection;
  },
  async close () {
    logger.info('Closing HTTP server.');
    
    // promisify close function - use promise instead callback
    if (this.connection) {
      
      const closePromisify = util.promisify(this.connection.close.bind(this.connection));
      // close http server
      await closePromisify();
      logger.info('HTTP server closed.');
      
      // disconnect from database
      await database.disconnect();
      return this.connection;
    } else {
      logger.warn('HTTP server not running!');
    }
  }
};

module.exports = server;
