import { Types } from "mongoose";


export interface IFriend {
    sender: Types.ObjectId;
    receiver: Types.ObjectId;
    status: string;
    acceptedAt: Date;
}
