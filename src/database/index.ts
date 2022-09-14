import mongoose from "mongoose";
import logger from "logger";
import { DEFAULT_DB_TIMEOUT } from "constant";

async function connect(): Promise<typeof mongoose> {
  logger.info("Opening mongoose connection.");
  return mongoose.connect(process.env.MONGO_URL, {
    serverSelectionTimeoutMS: DEFAULT_DB_TIMEOUT,
    socketTimeoutMS: DEFAULT_DB_TIMEOUT,
    connectTimeoutMS: DEFAULT_DB_TIMEOUT,
    waitQueueTimeoutMS: DEFAULT_DB_TIMEOUT,
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
