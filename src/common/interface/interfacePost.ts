import { Types } from "mongoose";
import { AllowCommentEnum, AvailabilityEnum } from "../enum";


export interface IPost {
    content?: string;
    attachments?: string[];
    allowComment: AllowCommentEnum;
    availability: AvailabilityEnum;
    tags?: Types.ObjectId[];
    createdBy: Types.ObjectId;
    DeletedBy: Types.ObjectId;
    DeletedAt: Date;
    restoredBy: Types.ObjectId;
    restoredAt: Date;
    assetFolderId?: string;
    createdAt?: Date;
    updatedAt?: Date;
    likes :Types.ObjectId[];

}
