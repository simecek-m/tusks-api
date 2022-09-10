// imports
import "env";
import express, { Application } from "express";
import { json } from "body-parser";
import morgan from "morgan";
import cors from "cors";
import { errorHandler } from "middleware/error";
import server from "server";
import logger from "logger";
import { checkJwt } from "auth";

// imported routes
import protectedRoutes from "router/protectedRoutes";
import fallbackRoutes from "router/fallbackRoutes";

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

  // authentication middleware
  app.use(checkJwt);

  // api protected routes
  app.use("/api", protectedRoutes);

  // error handling
  app.use("/", fallbackRoutes);
  app.use(errorHandler);

  // run HTTP server
  await server.start(app);
  return app;
}

export async function stop(): Promise<Application> {
  await server.close();
  logger.info("Application was stopped!");
  return app;
}
