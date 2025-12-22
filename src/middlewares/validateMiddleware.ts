
import type { Request, Response, NextFunction } from 'express';
import validator from "validator"
import AppError from '../models/AppError.js';




export const validateNoteMiddlewareOptional = (keys: string[]) => {


    return (req: Request, res: Response, next: NextFunction) => {
        //check if body consisit of title ,content fields


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
          return  next(new AppError(errors.join(','), 400,"Validation Failure"))

        }
        

    }

}

export const validateNoteMiddlewareStrict = (keys: string[]) => {


    return (req: Request, res: Response, next: NextFunction) => {
        //check if body consisit of title ,content fields


        const errors: string[] = []
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
         

            next(new AppError(errors.join(','), 400,"Validation Failure"))
        }
    

    }

}