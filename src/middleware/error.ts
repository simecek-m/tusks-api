import { NextFunction, Request, Response } from "express";
import logger from "logger";
import { Error } from "types";

export function errorHandler(
  error: Error,
  _: Request,
  res: Response,
  next: NextFunction
) {
  logger.error(error.message);
  res.status(error.status || 400).send(error);
  next();
}
