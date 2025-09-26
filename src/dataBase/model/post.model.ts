import { Schema, model, Types } from "mongoose";

export enum AllowCommentEnum {
  allow = "allow",
  disable = "disable",
}

export enum AvailabilityEnum {
  public = "public",
  private = "private",
  followers = "followers",
}

export interface IPost {
  content?: string;
  attachments?: string[];
  allowComment: AllowCommentEnum;
  availability: AvailabilityEnum;
  tags?: Types.ObjectId[];
  createdBy: Types.ObjectId;
  assetFolderId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const postSchema = new Schema<IPost>(
  {
    content: {
      type: String,
      maxlength: 100000,
    },
    attachments: {
      type: [String],
      default: [],
    },
    allowComment: {
      type: String,
      enum: Object.values(AllowCommentEnum),
      default: AllowCommentEnum.allow,
    },
    availability: {
      type: String,
      enum: Object.values(AvailabilityEnum),
      default: AvailabilityEnum.public,
    },
    tags: [
      {
        type: Schema.Types.ObjectId,
        ref: "Tag", 
      },
    ],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assetFolderId: {
      type: String,
    },
  },
  { timestamps: true }
);

export const PostModel = model<IPost>("Post", postSchema);
