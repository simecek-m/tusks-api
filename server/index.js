const { port, mode } = require('~config');
const database = require('~database');
const util = require('util'); 
const http = require('http');
const logger = require('~logger');

const server = {
  connection: null,
  async start (app) {
    logger.info('Opening HTTP server.');

    // crate http server
    const httpServer = http.createServer(app);
    this.connection = httpServer;

    // promisify listen function - use promise instead callback
    const listenPromisify = util.promisify(httpServer.listen.bind(httpServer));

    // open http server
    await listenPromisify(port);
    logger.info(`App is running in ${mode} mode.`);

    // try to connect to db
    try {
      await database.connect();
    } catch (error) {
      logger.warn(`Can't connect to database: ${error.message}!`);
    }
    return this.connection;
  },
  async close () {
    logger.info('Closing HTTP server.');
    
    // promisify close function - use promise instead callback
    const httpServer = this.connection;
    const closePromisify = util.promisify(httpServer.close.bind(httpServer));

    // close http server
    await closePromisify();
    
    // disconnect from database
    await database.disconnect();
    return this.connection;
  }
};

module.exports = server;
