import { Types } from "mongoose";
import { GenderType } from "../enum/enumGender";
import { RoleType } from "../enum/enumRole";
import { ProviderType } from "../enum/ProviderType";

export interface IUser { 
    _id : Types.ObjectId,
    FName : string,
    LName : string ,
    UserName? :string,
    password : string ,
    email: string, 
    age: number , 
    phone? :string ,
    address? :string ,
    image? :string ,
    gender :GenderType,
    role? : RoleType,
    provider? : ProviderType,
    CreatedAt : Date,
    otp?: string ,
    UpdateAt : Date,
    confirmed ?: boolean,
    changeCredentials :Date
}