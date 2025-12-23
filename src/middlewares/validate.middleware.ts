
import type { Request, Response, NextFunction } from 'express';
import validator from "validator"
import AppError from '../utils/app.error.js';




export const validateNoteMiddlewareOptional = (keys: string[]) => {


    return (req: Request, res: Response, next: NextFunction) => {
       
        /*
        Check if body has fileds
        */
        if (!req.body) {
            return next(new AppError('Request body is missing', 400, 'Validation Failure'));
        }

        const errors: string[] = []
        keys.forEach(key => {
            const value = req.body[key]

            if (value !== undefined) {
                if (typeof value !== 'string') {
                    errors.push(`Invalid type for ${key}`)
                } else if (validator.isEmpty(value, { ignore_whitespace: true })) {
                    errors.push(`${key} is empty`)

                }

            }
        }
        )
        if (errors.length > 0) {
            return next(new AppError(errors.join(','), 400, "Validation Failure"))
        }
        next()
}
}

export const validateNoteMiddlewareStrict = (keys: string[]) => {


    return (req: Request, res: Response, next: NextFunction) => {
        const errors: string[] = []
        
        /*
        Check if body has fileds
        */
        if (!req.body) {
            return next(new AppError('Request body is missing', 400, 'Validation Failure'));
        }


        keys.forEach(key => {
            const value = req.body[key]

            if (value === undefined) {
                errors.push(`empty body ${key}`)
            } else if (typeof value !== 'string') {
                errors.push(`Invalid type for ${key}`)
            } else if (validator.isEmpty(value, { ignore_whitespace: true })) {
                errors.push(`${key} is empty`)
            }

        }

        )

        if (errors.length > 0) {
            return next(new AppError(errors.join(','), 400, "Validation Failure"))
        }
        next()
    }

}