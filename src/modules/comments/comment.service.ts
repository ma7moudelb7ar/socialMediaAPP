import { NextFunction, Request, Response } from "express";
import { userRepository } from "../../dataBase/Repository/user.Repository";
import userModel from "../../dataBase/model/user.model";
import { PostModel } from "../../dataBase/model/post.model";
import { postRepository } from "../../dataBase/Repository/post.Repository";
import { AppError } from '../../utils/security/error/classError';
import { DeleteFiles, uploadFiles } from "../../utils";
import { v4 as uuidv4 } from "uuid";
import { commentRepository } from "../../dataBase/Repository/commentRepository";
import { commentModel } from "../../dataBase/model/comment.model";
import { AllowCommentEnum, AvailabilityEnum, onModelEnum,  } from "../../common";



class CommentService {
    private _userModel = new userRepository(userModel);
    private _postModel = new postRepository(PostModel);
    private _CommentModel = new commentRepository(commentModel);
  
    constructor() {}
  
    createComment = async (req: Request, res: Response, next: NextFunction) => {

      let { content, tags, attachments, onModel }  = req.body;
      const {postId , commentId} = req.params

      if (commentId) {
      if (onModel !== onModelEnum.Comment) {
        throw new AppError("onModel must be 'Comment'", 400);
      }
      const comment = await this._CommentModel.findOne(
        {
        _id :commentId,
        refId : postId
      },undefined , {
        populate : {
          path : "refId",
          match : {
            allowComment : AllowCommentEnum.allow,
          }
        }
      }
    )
    if (!comment?.refId) {
      throw new AppError("comment not found or not authorization", 404);
    }
      }

      const post =  await this._postModel.findOne({
        _id :postId,
        allowComment : AllowCommentEnum.allow,
        availability : 'public'
      })
      if (!post) {
        throw new AppError("not found post", 404);
      }
      if (
        tags?.length
        && 
        (await this._userModel.find({filter : { _id :{$in :tags}} })).length !==tags?.length
      ) {
        throw new AppError("Invalid id", 404);
      }

      const assetFolderId = uuidv4()

      if (req?.files?.length) {
        attachments = await uploadFiles({
          files : req?.files as unknown as Express.Multer.File[],
          path : `users/${post?.createdBy}/posts/${post?.assetFolderId}/${assetFolderId}`
        })
      }


      const comment =await this._CommentModel.create({
        postId ,
        ...req.body,
        attachments,
        assetFolderId,
        createdBy: req?.user?._id
      })

      if (!comment) {
        await DeleteFiles({
          urls : attachments
        })
        throw new AppError("fail to create comment", 500);
      }
      return res.status(201).json({ message: "created", comment});
    };


  }

export default new CommentService()