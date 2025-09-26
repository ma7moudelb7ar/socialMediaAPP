import { NextFunction, Request, Response } from "express";
import { userRepository } from "../../dataBase/Repository/user.Repository";
import userModel from "../../dataBase/model/user.model";
import { PostModel } from "../../dataBase/model/post.model";
import { postRepository } from "../../dataBase/Repository/post.Repository";
import { AppError, uploadFiles } from "../../utils";
import { v4 as uuidv4 } from "uuid";
import { StorageType } from "../../common/enum";


class PostService {
    private _userModel = new userRepository(userModel);
    private _postModel = new postRepository(PostModel);
  
    constructor() {}
  
    createPost = async (req: Request, res: Response, next: NextFunction) => {
      if (
        req.body?.tags?.length &&
        !(await this._userModel.findOne({ _id: { $in: req.body.tags } }))
      ) {
        return next(new AppError("some tags are not valid", 400));
      }
  
      const assetFolderId = uuidv4();
  
      if (req.body?.attachments?.length) {
        req.body.attachments = await uploadFiles({
          files: req.files as Express.Multer.File[],
          path: `users/${req.user?.id}/posts/${assetFolderId}`,
          storeType: StorageType.cloud,
        });
      }
  
      const post = await this._postModel.create({
        ...req.body,
        createdBy: req.user?.id,
        assetFolderId: req.body.attachments?.length ? assetFolderId : undefined,
      });
  
      return res.status(201).json({ message: "created", post });
    };
  }

export default new PostService()