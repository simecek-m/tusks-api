import { ValidationError } from "error/ValidationError";
import { NextFunction, Request, Response } from "express";
import { AnyObjectSchema, ValidationError as YupValidationError } from "yup";

export function validate(schema: AnyObjectSchema) {
  return async (req: Request, _: Response, next: NextFunction) => {
    try {
      const validatedSchema = await schema.validate(req.body, {
        abortEarly: false,
      });
      req.body = validatedSchema;
      next();
    } catch (error) {
      if (error instanceof YupValidationError) {
        const errors = error.inner.map((innerError) => ({
          field: innerError.path,
          message: innerError.message,
        }));
        next(new ValidationError(error.name, errors));
      } else {
        next(error);
      }
    }
  };
}
