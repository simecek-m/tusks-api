import { Application } from "express";
import { createServer, Server } from "http";
import logger from "logger";

export async function start(app: Application): Promise<void> {
  logger.info("Starting HTTP server.");
  const server: Server = createServer(app);
  function promisifyStart(): Promise<void> {
    return new Promise((res, rej) => {
      server.on("listening", res).on("error", rej).listen(process.env.PORT);
    });
  }
  return promisifyStart();
}

export default { start };
