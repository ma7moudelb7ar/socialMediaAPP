import { Router } from "express";
import { authentication, validation } from "../../middlewares";
import PS from "./post.service";
import * as PV from "./post.valdation";



const postRouter =Router()

postRouter.post("/" ,authentication(),validation(PV.createPostSchema),  PS.createPost)



export default postRouter

