import mongoose from "mongoose";
import { IRevokeToken } from "../../common/interface/interfaceRevokeToken";



const RevokeTokenSchema = new  mongoose.Schema <IRevokeToken>({

    userId: {type : mongoose.Schema.Types.ObjectId  , required : true ,  ref : "User"} , 
    expireAt : { type : Date ,  required : true } ,
    tokenId : { type : String  ,  required : true } ,
},{
    timestamps : true,
})


const RevokeTokenModel = mongoose.models.RevokeToken || mongoose.model<IRevokeToken>( "RevokeToken",RevokeTokenSchema )


export default RevokeTokenModel