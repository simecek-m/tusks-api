// import environment variables
import "env";

// imports
import { checkJwt } from "auth";
import { json } from "body-parser";
import cors from "cors";
import express, { Application } from "express";
import logger from "logger";
import { errorHandler } from "middleware/error";
import morgan from "morgan";
import server from "server";
import { useTreblle } from "treblle";

// import routes
import database from "database";
import fallbackRoutes from "router/fallbackRoutes";
import protectedRoutes from "router/protectedRoutes";

// create express app
const app: Application = express();

export async function start(): Promise<Application> {
  logger.info(`App is running in ${process.env.MODE} mode.`);

  // parse json object from request body
  app.use(json());

  // enable all CORS
  app.use(cors());

  // use morgan HTTP logger with winston logger
  app.use(
    morgan("short", {
      stream: {
        write: (message) => logger.debug(message.trim()),
      },
    })
  );

  // API monitoring & documentation middleware - only in production
  if (process.env.MODE === "production") {
    useTreblle(app, {
      apiKey: process.env.TREBLLE_API_KEY,
      projectId: process.env.TREBLLE_PROJECT_ID,
    });
  }

  // authentication middleware
  app.use(checkJwt);

  // api protected routes
  app.use("/api", protectedRoutes);

  // error handling
  app.use("/", fallbackRoutes);
  app.use(errorHandler);

  // start HTTP server
  try {
    await server.start(app);
    logger.info(
      `HTTP server is running on port: ${process.env.EXPRESS_SERVER_PORT}.`
    );
  } catch (e) {
    logger.error("Error while starting HTTP server", e);
  }

  // connect to database
  try {
    await database.connect();
    logger.info("Successfully connected to Mongo database.");
  } catch (error) {
    logger.error(`Can't connect to Mongo database: ${error.message}!`);
  }
  return app;
}
