import type { Request, Response, NextFunction } from 'express';
import AppError from '../utils/app.error.js';

export const globalErrorHandler=(err:AppError|Error,req:Request,res:Response,next:NextFunction)=>{

if(err instanceof AppError){
  err.status=err.status||'error'
  err.statusCode=err.statusCode||500

 return res.status(err.statusCode).json({
    status:err.status,
    message:err.message,

  })
}

return res.status(500).json({
  status:'error',
  message:'Bad Request'
})

}