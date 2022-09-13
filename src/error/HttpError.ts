import { IHttpError } from "types";

export class HttpError implements IHttpError {
  status?: number;
  message: string;
}
