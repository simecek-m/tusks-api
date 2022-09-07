import mongoose from "mongoose";
import logger from "logger";

async function connect(): Promise<typeof mongoose> {
  logger.info("Opening mongoose connection.");
  return mongoose.connect(process.env.MONGO_URL);
}

async function disconnect(): Promise<void> {
  logger.info("Closing mongoose connection.");
  return mongoose.disconnect();
}

export default {
  connect,
  disconnect,
};
