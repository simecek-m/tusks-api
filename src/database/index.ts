import mongoose, { ConnectOptions } from "mongoose";
import logger from "logger";
import { DEFAULT_DB_TIMEOUT } from "constant";

const CONNECTION_STRING_STANDARD_PREFIX = "mongodb";
const CONNECTION_STRING_DNS_PREFIX = "mongodb+srv";
const DEFAULT_CONNECTION_OPTIONS: ConnectOptions = {
  dbName: process.env.MONGO_DATABASE_NAME,
  serverSelectionTimeoutMS: DEFAULT_DB_TIMEOUT,
  connectTimeoutMS: DEFAULT_DB_TIMEOUT,
  bufferCommands: false,
};

async function connect(): Promise<typeof mongoose> {
  logger.info("Opening mongoose connection.");
  const CONNECTION_STRING = getConnectionString();
  const CONNECTION_OPTIONS = getConnectionOptions();
  return mongoose.connect(CONNECTION_STRING, CONNECTION_OPTIONS);
}

async function disconnect(): Promise<void> {
  logger.info("Closing mongoose connection.");
  return mongoose.disconnect();
}

function getConnectionString(): string {
  return process.env.MONGO_CONNECTION_STRING_FORMAT === "standard"
    ? `${CONNECTION_STRING_STANDARD_PREFIX}://${process.env.MONGO_SERVER_HOST}:${process.env.MONGO_SERVER_PORT}`
    : `${CONNECTION_STRING_DNS_PREFIX}://${process.env.MONGO_SERVER_HOST}`;
}

function getConnectionOptions(): ConnectOptions {
  return process.env.MONGO_AUTHENTICATION === "enabled"
    ? {
        ...DEFAULT_CONNECTION_OPTIONS,
        user: process.env.MONGO_USER,
        pass: process.env.MONGO_PASSWORD,
      }
    : DEFAULT_CONNECTION_OPTIONS;
}

function enableLoggers() {
  mongoose.connection.on("connected", () => {
    logger.info("Database connected!");
  });
  mongoose.connection.on("disconnected", () => {
    logger.error("Database disconnected!");
  });
}

export default {
  connect,
  disconnect,
  enableLoggers,
};
