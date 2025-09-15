import { NextFunction, Request, Response } from "express"
import { AppError } from "../utils/security/error/classError"


export const GlobalError =  ( err : AppError , req : Request, res : Response, next :NextFunction )=> {
        return res.status(err.statuscode as unknown as number || 500 ).json({
            message : err.message,
            stack : err.stack ,
            error : err
        })
    }