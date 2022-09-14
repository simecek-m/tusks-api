import { HttpError } from "./HttpError";

export class UnexpectedError extends HttpError {
  cause: Error;

  constructor(cause: Error) {
    super(500, "Unexpected error");
    this.cause = cause;
  }
}
