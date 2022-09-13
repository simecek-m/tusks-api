import { IParamError, IValidationError } from "types";

export class ValidationError implements IValidationError {
  type: string;
  errors: IParamError[];

  constructor(type: string, errors: IParamError[]) {
    this.type = type;
    this.errors = errors;
  }
}
