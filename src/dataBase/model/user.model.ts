import mongoose from "mongoose";
import { IUser } from "../../common/interface/interfaceUser";
import { GenderType } from "../../common/enum/enumGender";
import { RoleType } from "../../common/enum/enumRole";
import { ProviderType } from "../../common/enum/ProviderType";


const userSchema = new  mongoose.Schema <IUser>({

        FName : {type :String ,required : true ,min: 2 , max : 10 ,trim : true },
        LName : {type :String ,required : true , min : 2 , max : 5 ,trim : true } ,
        password : {type :String, required : function (){ 
            return this.provider===ProviderType.google? false :true
        } ,} ,
        image : {type :String} ,
        email: {type :String ,required : true, unique : true }, 
        age: { type :Number ,min : 18  , max : 60,required : function (){ 
            return this.provider===ProviderType.google? false :true
        }} , 
        phone :{ type :String  } ,
        address :{type :String} ,
        gender :{type : String , enum : GenderType , required :function (){ 
            return this.provider===ProviderType.google? false :true
        }},
        otp : {type : String} ,
        role : { type : String , enum : RoleType , default : RoleType.user},
        provider : { type : String , enum : ProviderType , default : ProviderType.system},
        confirmed : { type : Boolean},
        changeCredentials : { type : Date}

},{
    timestamps : true,
    strictQuery:true ,
    toObject: {virtuals : true } ,
    toJSON : { virtuals : true }
})


userSchema.virtual("UserName").set(function(value) { 
    const [FName , LName] = value.split(" ")
    this.set({FName , LName})
}).get(function () { 
    return this.FName + " " + this.LName
})
// // save == document Middlewares
// userSchema.pre("save" , async function (next) {
//     console.log("---------------------pre -------------------------");
//     console.log(this);
//     // next()
// })
// userSchema.post("save" , function () {
//     console.log("---------------------post -------------------------");
//     console.log(this);
// })




const userModel = mongoose.models.User || mongoose.model<IUser>( "User",userSchema )


export default userModel