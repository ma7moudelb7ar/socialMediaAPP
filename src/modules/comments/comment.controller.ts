import { Router } from "express";
import CS from "./comment.service";
import { authentication } from "../../middlewares/authentication";
import { validation } from "../../middlewares/validation";
import { FileValidation, multerCloud } from "../../middlewares/multer.cloud";
import * as CV from "./comment.validation";



const commentRouter =Router({mergeParams :true})

commentRouter.post("/" ,authentication(), 
    multerCloud({FileTypes :FileValidation.image}).array("attachments",2),
    validation(CV.createCommentSchema),
    CS.createComment)




export default commentRouter

