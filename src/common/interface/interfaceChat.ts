import { Types } from "mongoose";
import { IMessage } from "./interfaceMessage";

export interface IChat {
  participants: Types.ObjectId[];
  createdBy: Types.ObjectId;

  group?: boolean;
  groupName?: string;
  groupImage?: string;
  roomId?: string;

  
  lastMessage?: IMessage;

  createdAt?: Date;
  updatedAt?: Date;
}
