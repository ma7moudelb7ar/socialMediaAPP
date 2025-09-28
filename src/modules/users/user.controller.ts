import { Router } from "express";
import US from "./user.service";
import * as UV from "./user.validation";
import { TokenType } from "../../common/enum/TokenType";
import { validation } from "../../middlewares/validation";
import { authentication } from "../../middlewares/authentication";



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
userRouter.delete("/FreezeAccount{/:userId}" ,authentication(),validation(UV.FreezeAccountSchema),  US.FreezeAccount)
userRouter.delete("/unFreezeAccount/:userId" ,authentication(),validation(UV.unFreezeAccountSchema),  US.unFreezeAccount)

userRouter.post("/uploadImage" ,authentication(),
    // multerCloud({}).array("images"),
    US.uploadImage)


export default userRouter