import { NextFunction, Request, Response } from "express";
import { userRepository } from "../../dataBase/Repository/user.Repository";
import userModel from "../../dataBase/model/user.model";
import { PostModel } from "../../dataBase/model/post.model";
import { postRepository } from "../../dataBase/Repository/post.Repository";
import { AppError } from './../../utils/security/error/classError';
import { DeleteFiles, uploadFiles } from "../../utils";
import { v4 as uuidv4 } from "uuid";
import { likeSchemaQueryType, likeSchemaType } from "./post.validation";
import { actionEnum, AvailabilityEnum, IPost } from "../../common";
import mongoose, { UpdateQuery } from "mongoose";
import { commentRepository } from "../../dataBase/Repository/commentRepository";
import { commentModel } from "../../dataBase/model/comment.model";


class PostService {
    private _userModel = new userRepository(userModel);
    private _postModel = new postRepository(PostModel);
    private _CommentModel = new commentRepository(commentModel);
    constructor() {}
  
    createPost = async (req: Request, res: Response, next: NextFunction) => {

      let { content, availability, allowComment, tags, attachments } = req.body;
      if (
        tags?.length
        && 
        (await this._userModel.find({ filter : { _id :{$in :tags}} })).length !==tags?.length
      ) {
        throw new AppError("Invalid id", 404);
      }

      const assetFolderId = uuidv4()

      if (req?.files?.length) {
        attachments = await uploadFiles({
          files : req?.files as unknown as Express.Multer.File[],
          path : `users/${req?.user?._id}/posts/${assetFolderId}`
        })
      }

      const post =await this._postModel.create({
        ...req.body,
        attachments,
        assetFolderId,
        createdBy: req?.user?._id,
        allowComment,
        availability
      })

      if (!post) {
        await DeleteFiles({
          urls : attachments
        })
        throw new AppError("fail to create post", 500);
      }
      return res.status(201).json({ message: "created", post });
    };

    like = async (req: Request, res: Response, next: NextFunction) => {
      const {PostId} : likeSchemaType = req.params as  likeSchemaType
      const {action} : likeSchemaQueryType = req.query as likeSchemaQueryType

      let updateQuery :UpdateQuery<IPost> = {$addToSet : {likes : req?.user?._id}}
      if (action == actionEnum.dislike) {
        updateQuery = { $pull : {likes : req?.user?._id}}
      }
      const post =  await this._postModel.findOneAndUpdate(
        {_id : PostId,
          $or:[
            {availability : AvailabilityEnum.public},
            {availability : AvailabilityEnum.private , createdBy : req?.user?._id},
            {availability : AvailabilityEnum.friends , createdBy :{$in:[ ...req?.user?.friends || [] , req?.user?._id]}},
          ]
        }
        ,{...updateQuery })
      if (!post) {
        throw new AppError("post not found", 404);
  }
      
      return res.status(200).json({ message: `${action}`,  post});
    }

    updatePost = async (req: Request, res: Response, next: NextFunction) => {
    
    
      const {PostId} : likeSchemaType = req.params as  likeSchemaType

      const post = await this._postModel.findOne( {
        _id : PostId ,
        createdBy :req?.user?._id,
        paranoid : false
      })
      if (!post) {
        throw new AppError("not authorized updatePost" ,404);
      }

      if (req?.body?.content) {
        post.content = req.body.content
      }

      if (req?.body?.availability) {
        post.availability = req.body.availability
      }

      if (req?.body?.allowComment) {
        post.allowComment = req.body.allowComment
      }

      if (req?.body?.tags?.length) {
        if (req?.body?.tags?.length 
          && (await this._userModel.find({filter : {_id :{$in : req?.body?.tags}} })).length !==req?.body?.tags?.length
        ){
          post.tags =req.body.tags
        }
      }

      if (req?.files?.length) {
      await DeleteFiles({urls : post.attachments  || []})
      
      post.attachments = await uploadFiles({
        files : req?.files as unknown as Express.Multer.File[], 
        path : `users/${req?.user?._id}/posts/${post.assetFolderId}`
      })
    }

    await post.save()

      return res.status(201).json({ message: "updated"  , post});
    };


    getPosts = async (req: Request, res: Response, next: NextFunction) => {

      // let {page=1 , limit = 5 } = req.query as unknown as {page : number ,  limit : number} 

      // const {docs , currentPage ,pageOfNumber, count} = await this._postModel.paginate({filter : {} , query : {page , limit}})
      
      // let result = []
      // for (const post of posts) {
        //   const comments = await this._CommentModel.find({filter : {postId : post._id}})
        
        //   result.push({...post ,  comments})
        // }
        
        const posts = await this._postModel.find({filter : {}, options : {
          populate : "Comments"
        }})
      return res.status(201).json({ message: "success" ,posts });
    }
  }

export default new PostService()