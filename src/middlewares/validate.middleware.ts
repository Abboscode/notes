import type { Request, Response, NextFunction } from "express";
import validator from "validator";
import AppError from "../utils/app.error.js";

type ValidationOptions = {
    isRequired?: boolean;
};

// Generic validation factory
export const validateBody = (fields: string[], options: ValidationOptions = {}) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { isRequired = true } = options;

        if (!req.body || typeof req.body !== "object") {
             return next(new AppError("Request body is missing or invalid", 400, "Validation Failure"));
        }

        const errors: string[] = [];
        const body = req.body as Record<string, unknown>;

        fields.forEach((field) => {
            const value = body[field];

            // 1. Check existence
            if (value === undefined) {
                if (isRequired) {
                    errors.push(`${field} is required`);
                }
                return; // Skip further checks if missing (and strictly not required)
            }

            // 2. Check Type
            if (typeof value !== "string") {
                errors.push(`${field} must be a string`);
                return;
            }

            // 3. Check Empty (only if it exists)
            if (validator.isEmpty(value, { ignore_whitespace: true })) {
                errors.push(`${field} cannot be empty`);
            }
        });

        if (errors.length > 0) {
            return next(new AppError(errors.join("; "), 400, "Validation Failure"));
        }

        next();
    };
};

