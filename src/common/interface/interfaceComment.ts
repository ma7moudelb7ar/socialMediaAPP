import { Types } from "mongoose";
import { onModelEnum } from "../enum";


export interface IComment {
    content?: string;
    attachments?: string[];
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
    refId :Types.ObjectId;
    onModel : onModelEnum
}
