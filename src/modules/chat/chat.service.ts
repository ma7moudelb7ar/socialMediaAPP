
import { NextFunction, Request, Response } from "express";
import { chatRepository } from "../../dataBase/Repository/chatRepository";
import { chatModel } from "../../dataBase/model/chat.model";
import { AppError } from "../../utils";




export class chatService {
    

    private _chatModel= new chatRepository(chatModel)
    getChat = async (req : Request , res : Response,  next : NextFunction) => {

        const {userId}  = req.params

        const chat = await this._chatModel.findOne({
            participants:{
                $all : [userId ,req?.user?._id]
            },
            group : { $exists : false },

        },{
            populate : [{
                path : "participants",
            }]
        })

        if (!chat) {
            throw new AppError("chat not found", 404);
        }

        return res.status(200).json({ message: "get chat success", chat })
    }

    //
}
