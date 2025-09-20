import { Router } from "express";
import US from "./user.service";
import { validation } from "../../middlewares/validation";
import { confirmEmailSchema, ForgetPasswordSchema, loginWithGmailSchema, logoutSchema, resetPasswordSchema, signInSchema, SignUpSchema } from "./user.validation";
import { authentication } from "../../middlewares/authentication";
import { TokenType } from "../../common/enum/TokenType";


const userRouter =Router()

userRouter.post("/signUp",validation(SignUpSchema) , US.signUp)
userRouter.patch("/confirmEmail",validation(confirmEmailSchema) , US.confirmEmail)
userRouter.post("/signIn" ,validation(signInSchema),  US.signIn)
userRouter.post("/loginWithGmail" ,validation(loginWithGmailSchema), US.loginWithGmail)
userRouter.get("/Profile" ,authentication(),  US.Profile)
userRouter.get("/RefreshToken" ,authentication(TokenType.refresh),  US.RefreshToken)
userRouter.post("/logout" ,authentication(),validation(logoutSchema),  US.logout)
userRouter.patch("/ForgetPassword" ,validation(ForgetPasswordSchema),  US.ForgetPassword)
userRouter.patch("/resetPassword" ,validation(resetPasswordSchema),  US.resetPassword)


export default userRouter