import { Schema, model } from "mongoose";
import { IComment, onModelEnum, } from "../../common";



const commentSchema = new Schema<IComment>(
  {
    content: {
      type: String,
      maxlength: 100000,
    },
    attachments: {
      type: [String],
      default: [],
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
    DeletedBy:{
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    refId:{
      type: Schema.Types.ObjectId,
      refPath: "onModel",
      required : true
    },
    onModel:{
      type: String,
      enum:onModelEnum,
      required : true
    },

    DeletedAt : { type : Date},
    restoredBy :{
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { 
    timestamps: true ,    
  }
);


commentSchema.pre(["findOne" , "find"], function (next) {
    const query = this.getQuery()
    const {paranoid , ...rest} = query
    if (paranoid === false) {
      this.setQuery({ ...rest})
    }else{
      this.setQuery({...rest , DeletedAt : { $exists : false} })
    }
    next()
})

commentSchema.virtual("replies" , { 
  ref: "Comment",
  localField:"_id",
  foreignField : "CommentId"
})

export const commentModel = model<IComment>("Comment", commentSchema);
