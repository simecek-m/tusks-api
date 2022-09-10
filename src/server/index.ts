import database from "database";
import { promisify } from "util";
import { createServer } from "http";
import logger from "logger";
import { Application } from "express";

const server = {
  connection: null,
  async start(app: Application) {
    logger.info("Starting HTTP server.");

    // create http server
    this.connection = createServer(app);

    // promisify listen function - use promise instead callback
    const listenPromisify = promisify(
      this.connection.listen.bind(this.connection)
    );

    // open http server
    await listenPromisify(process.env.PORT, process.env.IP_ADDRESS);
    logger.info(
      `HTTP server is running on ${process.env.IP_ADDRESS}:${process.env.PORT}.`
    );

    // try to connect to db
    try {
      await database.connect();
      logger.info("Successfully connected to Mongo database.");
    } catch (error) {
      logger.warn(`Can't connect to Mongo database: ${error.message}!`);
    }
    return this.connection;
  },
  async close() {
    logger.info("Closing HTTP server.");

    // promisify close function - use promise instead callback
    if (this.connection) {
      const closePromisify = promisify(
        this.connection.close.bind(this.connection)
      );
      // close http server
      await closePromisify();
      logger.info("HTTP server closed.");

      // disconnect from database
      await database.disconnect();
      return this.connection;
    } else {
      logger.warn("HTTP server not running!");
    }
  },
};

export default server;
