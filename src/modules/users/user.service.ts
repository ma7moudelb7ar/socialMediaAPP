import { NextFunction, Request, Response } from "express";
import { confirmEmailSchemaType, ForgetPasswordSchemaType, loginWithGmailSchemaType, logoutSchemaType, resetPasswordSchemaType, signInSchemaType, signUpSchemaType } from "./user.validation";
import { AppError ,Compare, Hash , GenerateToken , eventEmitter, CreateSignedUrl } from "../../utils";
import { ProviderType,logDevices,RoleType, StorageType } from "../../common/enum/";
import userModel from "../../dataBase/model/user.model";
import { userRepository } from "../../dataBase/Repository/user.Repository";
import { revokeTokenRepository } from './../../dataBase/Repository/RevokeToken.Repository';
import RevokeTokenModel from "../../dataBase/model/revokeToken";
import { generateOtp } from "../../service/sendEmail";
import { v4 as uuidv4 } from "uuid";
import { OAuth2Client, TokenPayload } from 'google-auth-library';

class UserService {
    private _userModel = new userRepository(userModel)
    private _RevokeModel= new revokeTokenRepository(RevokeTokenModel)

    constructor() { }
    signUp = async (req: Request, res: Response, next: NextFunction) => {
        const { UserName, email, password, confirmPassword, phone, age, gender }: signUpSchemaType = req.body

        if (await this._userModel.findOne({ email })) {
            throw new AppError("email already exist ", 409);
        }
        const hash = await Hash(password)
        const otp = generateOtp()
        const hashOtp = await Hash(String(otp))
        const user = await this._userModel.createOneUser({ UserName, email, otp: hashOtp, password: hash, phone, age, gender })
        eventEmitter.emit("confirmEmail", { email, otp })

        return res.status(201).json({ message: "success", user })
    }

    confirmEmail = async (req: Request, res: Response, next: NextFunction) => {

        const { email, otp }: confirmEmailSchemaType = req.body
        const user = await this._userModel.findOne({ email, confirmed: { $exists: false } })
        if (!user) {
            throw new AppError("user not found or already exist", 404);
        }
        if (! await Compare(otp, user?.otp!)) {
            throw new AppError("invalid otp", 400);
        }
        await this._userModel.updateOne({ email: user?.email }, { confirmed: true, $unset: { otp: " " } })
        return res.status(200).json({ message: "login success" })
    }

    signIn = async (req: Request, res: Response, next: NextFunction) => {
        const { email, password }: signInSchemaType = req.body

        const user = await this._userModel.findOne({ email, confirmed: {$exists : true } , provider : ProviderType.system })
        if (!user) {
            throw new AppError("user not found or not confirmed yet", 404);
        }
        if (! await Compare(password, user?.password!)) {
            throw new AppError("Invalid password", 409);
        }
        const jwtid =  uuidv4()

        const accessToken = await GenerateToken({
            payload: { id: user?._id, email: user?.email },
            signature: user.role === RoleType.user ? process.env.SIGNATURE_USER_TOKEN! : process.env.SIGNATURE_ADMIN_TOKEN!,
            options: { expiresIn:  60 * 10 , jwtid }
        })
        const RefreshToken = await GenerateToken({
            payload: { id: user?._id, email: user?.email },
            signature: user.role === RoleType.user ? process.env.REFRESH_SIGNATURE_USER_TOKEN! : process.env.REFRESH_SIGNATURE_ADMIN_TOKEN!,
            options: { expiresIn: "1y" ,  jwtid }
        })

        return res.status(200).json({ message: "login success", accessToken, RefreshToken })
    }

    loginWithGmail = async (req: Request, res: Response, next: NextFunction) => {
        const {idToken} :loginWithGmailSchemaType = req.body

        const client = new OAuth2Client();
            async function verify() {
                const ticket = await client.verifyIdToken({
                idToken ,
                audience: process.env.WEB_CLIENT_ID!,  
});
        const payload = ticket.getPayload();
        return payload ;
}
    const {name ,picture ,email_verified , email} = await verify() as TokenPayload 

    let user = await this._userModel.findOne({email })

    if (!user) {
        
        user = await this._userModel.create({
            UserName: name!, 
            email : email!,
            image : picture! ,
            confirmed: email_verified !,
            provider:ProviderType.google,
        })
    }
    if (user?.provider === ProviderType.system) {
        throw new AppError("please login with system", 400);
    }
        const jwtid =  uuidv4()
        const accessToken = await GenerateToken({
            payload: { id: user?._id, email: user?.email },
            signature: user.role === RoleType.user ? process.env.SIGNATURE_USER_TOKEN! : process.env.SIGNATURE_ADMIN_TOKEN!,
            options: { expiresIn:  60 * 2 , jwtid }
        })
        const RefreshToken = await GenerateToken({
            payload: { id: user?._id, email: user?.email },
            signature: user.role === RoleType.user ? process.env.REFRESH_SIGNATURE_USER_TOKEN! : process.env.REFRESH_SIGNATURE_ADMIN_TOKEN!,
            options: { expiresIn: "1y" ,  jwtid }
        })

        return res.status(200).json({ message: "login success",accessToken , RefreshToken })
    }

    Profile = async (req: Request, res: Response, next: NextFunction) => { 


        return res.status(200).json({ message: "get profile success", user :req.user })
    }

    logout = async (req: Request, res: Response, next: NextFunction) => { 
        const {flag} :logoutSchemaType = req.body
        if (flag === logDevices?.all) {
            await this._userModel.updateOne({_id : req.user?._id} ,{changeCredentials : new Date()} )
            return res.status(200).json({ message: "success logOut from all devises" })
        }
        if (flag === logDevices?.current) {
            await this._RevokeModel.create({ 
                tokenId : req?.decoded?.jti!, 
                userId : req.user?._id! , 
                expireAt: new Date( req.decoded?.exp! *1000 )
            })
        }
        return res.status(200).json({ message: "success logOut from this devise" })
    }

    RefreshToken = async (req: Request, res: Response, next: NextFunction) => { 
                const jwtid =  uuidv4()
        const accessToken = await GenerateToken({
            payload: { id: req?.user?._id, email: req?.user?.email },
            signature: req?.user?.role === RoleType.user ? process.env.SIGNATURE_USER_TOKEN! : process.env.SIGNATURE_ADMIN_TOKEN!,
            options: { expiresIn:  60 * 2 , jwtid }
        })
        const RefreshToken = await GenerateToken({
            payload: { id: req?.user?._id, email: req?.user?.email },
            signature: req?.user?.role! === RoleType.user ? process.env.REFRESH_SIGNATURE_USER_TOKEN! : process.env.REFRESH_SIGNATURE_ADMIN_TOKEN!,
            options: { expiresIn: "1y" ,  jwtid }
        })
        await this._RevokeModel.create({ 
                tokenId : req?.decoded?.jti!, 
                userId : req.user?._id! , 
                expireAt: new Date( req.decoded?.exp! *1000 )
            })
        return res.status(200).json({ message: "get profile success",accessToken , RefreshToken })
    }

    ForgetPassword = async (req: Request, res: Response, next: NextFunction) => {
        const { email } :ForgetPasswordSchemaType = req.body
        const user =  await this._userModel.findOne({email , confirmed :{$exists : true}})
        if (!user) {
            throw new AppError("user not found or not confirmed " , 404);
        }
        const otp =  generateOtp() 
        const hashOtp = await Hash(String(otp))
        eventEmitter.emit("ForgetPassword" , { email,otp})
        await this._userModel.updateOne({email : user?.email} , {otp :hashOtp})
        return res.status(200).json({ message: "send Code success", })
    }

    resetPassword = async (req: Request, res: Response, next: NextFunction) => {
        const { otp , email , password , confirmPassword } :resetPasswordSchemaType = req.body
        const user =  await this._userModel.findOne({email , otp :{$exists : true}})
        if (!user) {
            throw new AppError("user not found  " , 404);
        }
        if (! await Compare(otp ,user?.otp!)) {
            throw new AppError("Invalid Otp " , 400);
        }
        const hashPassword = await Hash(password)
        await this._userModel.updateOne({email : user?.email} , {password :hashPassword ,  $unset : {otp : " "}})
        return res.status(200).json({ message: "reset Password Success", })
    }

    uploadImage = async (req: Request, res: Response, next: NextFunction) => {
        
        // const Key = await uploadFiles({
        //     files : req.files as Express.Multer.File[]  ,
        //     path: `users/${req.user?._id}`,
        //     storeType: StorageType.cloud
        // })
        const {ContentType , originalname } = req.body
        
        const Key = await CreateSignedUrl({
            ContentType,
            originalname,
            path: `users/${req.user?._id}`,
        })

        
        return res.status(200).json({ message: "upload success", Key })
    }
}

export default new UserService()