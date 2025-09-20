import { NextFunction, Request, Response } from "express"
import { AppError } from './../utils/security/error/classError';
import { GetSignature } from './../utils/security/token/GetSignature';
import { DecodedTokenAndFetchUser } from './../utils/security/token/DecodedTokenAndFetchUser';
import { TokenType } from "../common/enum/TokenType";


export const authentication =  (tokenType : TokenType = TokenType.access) => {
    return async (req: Request, res: Response, next: NextFunction) => {
    const { authorization }  = req.headers
    const [ prefix, token ]  = authorization!.split(" ")  || []

    if (!prefix || !token) {
        throw new AppError("Invalid prefix or token", 400);
    }
    const signature = await GetSignature(tokenType ,prefix)
    if (!signature) {
        throw new AppError("Invalid signature", 400);
    }
    const decoded = await DecodedTokenAndFetchUser(token , signature)
    if (!decoded) {
        throw new AppError("Invalid decoded", 400);
    }
    req.user = decoded?.user
    req.decoded = decoded?.decoded

    return next();
}
}