import { NextFunction, Request, Response } from "express";
import { AppError } from "../../utils/security/error/classError";
import { signUpSchemaType } from "./user.validation";
import userModel from "../../dataBase/model/user.model";
import { userRepository } from "../../dataBase/Repository/user.Repository";
import { Hash } from "../../utils/security/hash/hash";
import { eventEmitter } from "../../utils/event/Event";

class UserService {

    // private _userModel :Model<IUser> = userModel
    private _userModel = new userRepository(userModel)

    constructor () {}
    signUp = async ( req : Request, res : Response, next :NextFunction )=> {
        const {UserName , email ,password , confirmPassword ,phone , age ,gender} :signUpSchemaType = req.body
        
        if ( await this._userModel.findOne({email})) {
            throw new AppError("email already exist " ,  409);
        }

        const hash = await Hash(password)
        const user= await this._userModel.createOneUser({UserName , email , password :hash  ,phone , age ,gender})
        
        eventEmitter.emit("confirmEmail" , {email} )

        return res.status(201).json({message : "success" , user})
    }

    signIn = ( req : Request, res : Response, next :NextFunction )=> {

        return res.status(200).json({message : "login success"})
    }
}

export default new UserService()