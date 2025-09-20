import { Types } from "mongoose";


export interface IRevokeToken { 

    userId : Types.ObjectId , 
    tokenId : string , 
    expireAt : Date,
}
