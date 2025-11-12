import { Router } from "express";
import PS from "./post.service";
import * as PV from "./post.validation";
import { authentication } from "../../middlewares/authentication";
import { validation } from "../../middlewares/validation";
import { FileValidation, multerCloud } from "../../middlewares/multer.cloud";
import commentRouter from "../comments/comment.controller";



const postRouter =Router()

postRouter.use("/:postId/comments{/:commentId/reply}", commentRouter)


postRouter.post("/" ,authentication(), 
    multerCloud({FileTypes :FileValidation.image}).array("attachments",2),
    validation(PV.createPostSchema)
    ,  PS.createPost)

postRouter.patch("/:PostId" ,authentication(),validation(PV.likeSchema),PS.like)

postRouter.patch("/update/:PostId" ,authentication(),
    multerCloud({FileTypes :FileValidation.image}).array("attachments",2),
    validation(PV.updatePostSchema),
    PS.updatePost)

postRouter.get("/" ,
    PS.getPosts)



export default postRouter

