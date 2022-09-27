import mongoose from "mongoose";
import logger from "logger";
import { DEFAULT_DB_TIMEOUT } from "constant";

async function connect(): Promise<typeof mongoose> {
  logger.info("Opening mongoose connection.");
  const url = `mongodb://${process.env.MONGO_USER}:${encodeURIComponent(
    process.env.MONGO_PASSWORD
  )}@${process.env.MONGO_SERVER}:${process.env.MONGO_PORT}`;
  logger.info(url);
  return mongoose.connect(url, {
    serverSelectionTimeoutMS: DEFAULT_DB_TIMEOUT,
    socketTimeoutMS: DEFAULT_DB_TIMEOUT,
    connectTimeoutMS: DEFAULT_DB_TIMEOUT,
    waitQueueTimeoutMS: DEFAULT_DB_TIMEOUT,
    dbName: process.env.MONGO_DATABASE,
  });
}

async function disconnect(): Promise<void> {
  logger.info("Closing mongoose connection.");
  return mongoose.disconnect();
}

export default {
  connect,
  disconnect,
};
