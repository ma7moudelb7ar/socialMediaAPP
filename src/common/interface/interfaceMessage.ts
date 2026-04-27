import { Types } from "mongoose";

export interface IMessage {
  content?: string;
  attachments?: string[];
  createdBy: Types.ObjectId;
  chatId: Types.ObjectId;
  seenBy?: Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}
