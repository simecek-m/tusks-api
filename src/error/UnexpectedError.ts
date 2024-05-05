import { HttpStatus } from "constant";
import { HttpError } from "./HttpError";

export class UnexpectedError extends HttpError {
  cause: Error;

  constructor(cause: Error) {
    super(HttpStatus.INTERNAL_SERVER_ERROR, "Unexpected error");
    this.cause = cause;
  }
}
