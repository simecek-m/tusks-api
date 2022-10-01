import { HttpError } from "error/HttpError";
import { UnexpectedError } from "error/UnexpectedError";
import { ValidationError } from "error/ValidationError";
import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "express-oauth2-jwt-bearer";
import logger from "logger";

interface ErrorResponse {
  code: number;
  message: string;
  description: string;
}

export function errorHandler(
  error: HttpError | ValidationError | UnexpectedError | UnauthorizedError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (error instanceof ValidationError) {
    logger.error("Error while validating DTO!");
    res.status(400).send(error);
  } else if (error instanceof UnexpectedError) {
    logger.error(`${error.message} -> ${req.path}:`, error.cause);
    const response: ErrorResponse = {
      code: error.status,
      message: error.message,
      description: error.cause.message,
    };
    res.status(error.status).send(response);
  } else if (error instanceof UnauthorizedError) {
    logger.error(`Unathorized error -> ${error.headers["WWW-Authenticate"]}`);
    const response: ErrorResponse = {
      code: error.status,
      message: error.message,
      description: error.headers["WWW-Authenticate"],
    };
    res.status(error.status).send(response);
  } else {
    logger.error(error.message);
    res.status(error.status || 400).send(error);
  }
  next();
}
