import { HttpError } from "error/HttpError";
import { UnexpectedError } from "error/UnexpectedError";
import { ValidationError } from "error/ValidationError";
import { NextFunction, Request, Response } from "express";
import logger from "logger";

export function errorHandler(
  error: HttpError | ValidationError | UnexpectedError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (error instanceof ValidationError) {
    logger.error("Error while validating DTO!");
    res.status(400).send(error);
  } else if (error instanceof UnexpectedError) {
    logger.error(`${error.message} -> ${req.path}:`, error.cause);
    res.status(error.status).send(error);
  } else {
    logger.error(error.message);
    res.status(error.status || 400).send(error);
  }
  next();
}