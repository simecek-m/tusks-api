const { port, mode } = require('~config');
const database = require('~database');
const colors = require('colors');
const util = require('util'); 
const http = require('http');

const server = {
  connection: null,
  async start (app) {
    console.log(colors.blue('opening http server'));

    // crate http server
    const httpServer = http.createServer(app);
    this.connection = httpServer;

    // promisify listen function - use promise instead callback
    const listenPromisify = util.promisify(httpServer.listen.bind(httpServer));

    // open http server
    await listenPromisify(port);
    console.log(colors.blue(`app is running in ${mode} mode`));

    // try to connect to db
    try {
      await database.connect();
    } catch (error) {
      console.log(colors.red(error.message));
    }
    return this.connection;
  },
  async close () {
    console.log(colors.yellow('closing http server'));
    
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
