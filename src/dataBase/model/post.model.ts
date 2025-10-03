import { Schema, model } from "mongoose";
import { AllowCommentEnum, AvailabilityEnum, IPost } from "../../common";




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
    likes:[
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
    DeletedAt : { type : Date},
    restoredBy :{
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { 
    timestamps: true ,    
    toObject: {virtuals : true } ,
    toJSON : { virtuals : true }
  }
);


postSchema.pre(["findOne" , "find"], function (next) {
    const query = this.getQuery()
    const {paranoid , ...rest} = query
    if (paranoid === false) {
      this.setQuery({ ...rest})
    }else{
      this.setQuery({...rest , DeletedAt : { $exists : false} })
    }
    next()
})


export const PostModel = model<IPost>("Post", postSchema);
