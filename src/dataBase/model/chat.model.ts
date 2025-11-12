import { Schema, Types, model } from "mongoose";

export interface IMessage {

  content : string,
  attachments : string[],
  createdBy : Types.ObjectId,

  createdAt : Date,
  updatedAt : Date,

}

export interface IChat {

  participants : Types.ObjectId[],
  createdBy : Types.ObjectId,
  messages : IMessage[],
  group : string,
  groupImage : string,
  roomId : string,

  createdAt : Date,
  updatedAt : Date,
}

const messageSchema = new Schema<IMessage>(

  {
    content : {
      type : String,
    },
    attachments : {
      type : [String],
    },
    createdBy : {
      type : Schema.Types.ObjectId,
      ref : "User",
    },
  }
)
const chatSchema = new Schema<IChat>(

  {
    participants : {
      type : [Types.ObjectId],
      ref : "User",
      required : true
    },
    createdBy : {
      type : Schema.Types.ObjectId,
      ref : "User",
      required : true
    },
    messages : {
      type : [messageSchema],
    },
    group : {
      type : String,
    },
    groupImage : {
      type : String,
    },
    roomId : {
      type : String,
    },
  }
);




export const chatModel = model<IChat>("Chat", chatSchema);
