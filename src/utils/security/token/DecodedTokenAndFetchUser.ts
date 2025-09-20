import { AppError } from '../error/classError';
import { VerifyToken } from './VerifyToken';
import { userRepository } from './../../../dataBase/Repository/user.Repository';
import userModel from './../../../dataBase/model/user.model';
import { revokeTokenRepository } from './../../../dataBase/Repository/RevokeToken.Repository';
import RevokeTokenModel from './../../../dataBase/model/revokeToken';

const _userModel = new userRepository(userModel)
const _RevokeModel= new revokeTokenRepository(RevokeTokenModel)


    export const DecodedTokenAndFetchUser = async (token : string, signature : string ) => { 
        const decoded = await VerifyToken({ token, signature})
    if (!decoded) {
        throw new AppError("Invalid token ", 400);
    }
    const user = await _userModel.findOne({ email: decoded?.email })
    if (!user) {
        throw new AppError("user not found ", 404);
    }
    if (!user?.confirmed) {
        throw new AppError("first confirmed ", 401);
    } 
    if ( await _RevokeModel.findOne ({tokenId : decoded?.jti})) {
        throw new AppError("token has been Revoked ", 401);
    }     
    if (user?.changeCredentials.getTime() > decoded?.iat! * 1000) {
        throw new AppError("token has been Revoked ", 401);
    }   
        return {decoded , user} ; 
    }