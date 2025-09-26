import { Router } from "express";
import US from "./user.service";
import * as UV from "./user.validation";
import { validation ,multerCloud , FileValidation,authentication} from "../../middlewares/";
import { TokenType } from "../../common/enum/TokenType";



const userRouter =Router()

userRouter.post("/signUp",validation(UV.SignUpSchema) , US.signUp)
userRouter.patch("/confirmEmail",validation(UV.confirmEmailSchema) , US.confirmEmail)
userRouter.post("/signIn" ,validation(UV.signInSchema),  US.signIn)
userRouter.post("/loginWithGmail" ,validation(UV.loginWithGmailSchema), US.loginWithGmail)
userRouter.get("/Profile" ,authentication(),  US.Profile)
userRouter.get("/RefreshToken" ,authentication(TokenType.refresh),  US.RefreshToken)
userRouter.post("/logout" ,authentication(),validation(UV.logoutSchema),  US.logout)
userRouter.patch("/ForgetPassword" ,validation(UV.ForgetPasswordSchema),  US.ForgetPassword)
userRouter.patch("/resetPassword" ,validation(UV.resetPasswordSchema),  US.resetPassword)
userRouter.post("/uploadImage" ,authentication(),
    // multerCloud({}).array("images"),
    US.uploadImage)


export default userRouter