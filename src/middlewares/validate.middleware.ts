import type { Request, Response, NextFunction } from "express";
import validator from "validator";
import AppError from "../utils/app.error.js";

type Body = Record<string, unknown>;

const validateStringField = (
  key: string,
  value: unknown,
  required: boolean,
  errors: string[]
): void => {
  if (value === undefined) {
    if (required) errors.push(`${key} is required`);
    return;
  }

  if (typeof value !== "string") {
    errors.push(`Invalid type for ${key}`);
    return;
  }

  if (validator.isEmpty(value, { ignore_whitespace: true })) {
    errors.push(`${key} is empty`);
  }
};

export const validateNoteMiddlewareStrict =
  (keys: string[]) =>
  (req: Request, res: Response, next: NextFunction): void => {
    if (!req.body || typeof req.body !== "object") {
      return next(
        new AppError("Request body is missing", 400, "Validation Failure")
      );
    }
    

    const body = req.body as Body;
    const errors: string[] = [];

    

    keys.forEach((key) =>
      validateStringField(key, body[key], true, errors)
    );

    if (errors.length > 0) {
      return next(
        new AppError(errors.join(", "), 400, "Validation Failure")
      );
    }

    next();
  };

export const validateNoteMiddlewareOptional =
  (keys: string[]) =>
  (req: Request, res: Response, next: NextFunction): void => {
    
    if (!req.body || typeof req.body !== "object") {
      return next(
         new AppError("Request body is missing", 400, "Validation Failure")
      );
    }

    const body = req.body as Body;
    const errors: string[] = [];

    keys.forEach((key) =>
      validateStringField(key, body[key], false, errors)
    );

    if (errors.length > 0) {
      return next(
        new AppError(errors.join(", "), 400, "Validation Failure")
      );
    }

    next();
  };
