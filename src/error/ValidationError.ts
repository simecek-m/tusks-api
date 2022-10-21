import { IFieldError } from "types";

export class ValidationError {
  type: string;
  errors: IFieldError[];

  constructor(type: string, errors: IFieldError[]) {
    this.type = type;
    this.errors = errors;
  }
}
