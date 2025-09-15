import { Router } from "express";
import US from "./user.service";
import { validation } from "../../middlewares/validation";
import { SignUpSchema } from "./user.validation";


const userRouter =Router()

userRouter.post("/signUp",validation(SignUpSchema) , US.signUp)
userRouter.post("/signIn" , US.signIn)


export default userRouter