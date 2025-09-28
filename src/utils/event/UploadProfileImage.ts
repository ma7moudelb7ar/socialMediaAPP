import userModel from "../../dataBase/model/user.model";
import { userRepository } from "../../dataBase/Repository/user.Repository";
import { DeleteFile, getFile } from "../Aws";
import { eventEmitter } from "./eventEmitter"

const _userModel = new userRepository(userModel)
eventEmitter.on("UploadProfileImage" , async (data ) => { 

    const {userId ,oldKey ,Key ,expiresIn}  = data
    console.log({data});

    setTimeout(async() => {
        try {
            await getFile({Key})
            await _userModel.findByIdAndUpdate(userId,{$unset : {tempProfileImage : ""}})
            
            if (oldKey) {
                await DeleteFile({Key : oldKey})
            }
        } catch (error : any) {
            if (error?.Code=='NoSuchKey') {
                if (!oldKey) {
                    await _userModel.findByIdAndUpdate(userId,{$unset : {ProfileImage : ""}})
                }else{
                    await _userModel.findByIdAndUpdate(userId,{$set : {ProfileImage : oldKey} , $unset : {tempProfileImage : ""}})
                }
            }
            
        }
    }, expiresIn*1000);

})
