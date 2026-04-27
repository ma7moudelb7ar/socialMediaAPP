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
import { Types } from "mongoose";



class CommentService {
    private _userModel = new userRepository(userModel);
    private _postModel = new postRepository(PostModel);
    private _CommentModel = new commentRepository(commentModel);
  
    constructor() {}
  
createComment = async (req: Request,res: Response,next: NextFunction) => {
  const { content, tags } = req.body;
  const { postId, commentId } = req.params;
  const onModel = commentId
    ? onModelEnum.Comment
    : onModelEnum.Post;


  if (!postId || !Types.ObjectId.isValid(postId)) {
    throw new AppError("invalid postId", 400);
  }


  const post = await this._postModel.findOne({
    _id: postId,
    allowComment: AllowCommentEnum.allow,
    availability:AvailabilityEnum.public,
  });

  if (!post) {
    throw new AppError("post not found or commenting disabled", 404);
  }


  let refId: Types.ObjectId;

  if (onModel === onModelEnum.Comment) {
    if (!commentId || !Types.ObjectId.isValid(commentId)) {
      throw new AppError("invalid commentId", 400);
    }

    const parentComment = await this._CommentModel.findOne({
      _id: commentId,
      onModel: onModelEnum.Post,
      refId: post._id,
    });

    if (!parentComment) {
      throw new AppError("parent comment not found", 404);
    }

    refId = parentComment._id;
  } else {
    refId = post._id;
  }


  if (tags?.length) {
    const uniqueTags = [...new Set(tags)];

    const usersCount = await this._userModel.countByIds(uniqueTags as string[]);

    if (usersCount !== uniqueTags.length) {
      throw new AppError("invalid tagged user id", 400);
    }
  }


  let attachments: string[] = [];
  const assetFolderId = crypto.randomUUID();

  if (req.files?.length) {
    attachments = await uploadFiles({
      files: req.files as Express.Multer.File[],
      path: `users/${post.createdBy}/posts/${post.assetFolderId}/comments/${assetFolderId}`,
    });
  }


  const comment = await this._CommentModel.create({
    content,
    attachments,
    tags,
    assetFolderId,
    refId,
    onModel,
    createdBy: req.user!._id,
  });

  if (!comment) {
    if (attachments.length) {
      await DeleteFiles({ urls: attachments });
    }
    throw new AppError("failed to create comment", 500);
  }

  return res.status(201).json({message: "comment created successfully",comment});
};



  }

export default new CommentService()