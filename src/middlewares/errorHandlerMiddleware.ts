import type { Request, Response, NextFunction } from 'express';
import AppError from '../models/AppError.js';

export const globalErrorHandler=(err:AppError|Error,req:Request,res:Response,next:NextFunction)=>{

if(err instanceof AppError){
  err.status=err.status||'error'
  err.statusCode=err.statusCode||500

  res.status(err.statusCode).json({
    status:err.status,
    message:err.message,

  })
}

res.status(500).json({
  status:'error',
  message:'Bad Request'
})

}