import mongoose from "mongoose";
import { IUser } from "../../common/interface/interfaceUser";
import { GenderType } from "../../common/enum/enumGender";
import { RoleType } from "../../common/enum/enumRole";


const userSchema = new  mongoose.Schema <IUser>({

        FName : {type :String   ,
                required : true ,
                min: 2 , max : 10 ,
                trim : true },
        LName : {type :String   ,
                required : true , 
                min : 2 , max : 5 ,
                trim : true } ,
        password : {type :String,
                    required : true ,} ,
        email: {type :String    ,
            required : true, 
            unique : true }, 
        age: { type :Number     ,
            required : true ,
            min : 18  , max : 60} , 
        phone :{type :String    ,required : true     } ,
        address :{type :String} ,
        gender :{type : String , enum : GenderType , required : true },
        role : { type : String , enum : RoleType , default : RoleType.user},

},{
    timestamps : true,
    toObject: {virtuals : true } ,
    toJSON : { virtuals : true }
})


userSchema.virtual("UserName").set(function(value) { 
    const [FName , LName] = value.split(" ")
    this.set({FName , LName})
}).get(function () { 
    return this.FName + " " + this.LName
})

const userModel = mongoose.models.User || mongoose.model<IUser>( "User",userSchema )


export default userModel