import { HttpStatusCode } from "types";

export class HttpError {
  status: number;
  message: string;

  constructor(status: HttpStatusCode, message: string) {
    this.status = status;
    this.message = message;
  }
}
