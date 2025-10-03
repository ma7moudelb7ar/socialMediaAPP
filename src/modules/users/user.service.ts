import { NextFunction, Request, Response } from "express";
import { confirmEmailSchemaType, ForgetPasswordSchemaType, FreezeAccountSchemaType, loginWithGmailSchemaType, logoutSchemaType, resetPasswordSchemaType, signInSchemaType, signUpSchemaType, unFreezeAccountSchemaType, updateEmailConfirmSchemaType, updateEmailSchemaType, updatePasswordSchemaType, updateProfileSchemaType } from "./user.validation";
import { AppError ,Compare, Hash , GenerateToken , eventEmitter, CreateSignedUrl } from "../../utils";
import { ProviderType,logDevices,RoleType } from "../../common/enum/";
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

        const user = await this._userModel.findOne({ email, confirmed: {$exists : true }, DeletedAt: { $exists: false } , provider : ProviderType.system })
        if (!user) {
            throw new AppError("user not found or not confirmed yet or freezed", 404);
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
            ProfileImage : picture! ,
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

        const user = await this._userModel.findOne({ DeletedAt: { $exists: false }, confirmed : {$exists : true}})
        if (!user) {
            throw new AppError("Account freezed ", 400);
        }

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
        
        const {ContentType , originalname } = req.body
        
        const {url ,Key} = await CreateSignedUrl({
            ContentType,
            originalname,
            path: `users/${req.user?._id}`,
        })

        const user = await this._userModel.findByIdAndUpdate(
            req?.user?._id! ,{
                ProfileImage:Key,
                tempProfileImage:req?.user?.ProfileImage
            })

        if (!user) {
            throw new AppError("user not found" ,  404);
        }

    eventEmitter.emit("UploadProfileImage" , {userId : req?.user?._id , oldKey : req?.user?.ProfileImage , Key ,expiresIn : 60})

        return res.status(200).json({ message: "upload success" ,url ,user })
    }

        FreezeAccount = async (req: Request, res: Response, next: NextFunction) => {
            const {userId} : FreezeAccountSchemaType = req.params  as { userId: string}

            if (userId&&req?.user?.role !==RoleType.admin) {
                throw new AppError("unauthorized" , 401);
            }
            const user = await this._userModel.findOneAndUpdate({_id :userId || req?.user?._id! , DeletedAt: { $exists: false }},
                {DeletedAt : new Date() ,DeletedBy : req.user?._id ,changeCredentials :new Date(),$unset  : {RestoreAt : "" , RestoreBy: "" }})
                if (!user) {
                    throw new AppError("user not found or freezed" , 404);
                }

        return res.status(200).json({ message: "Freeze success", })
    }

        unFreezeAccount = async (req: Request, res: Response, next: NextFunction) => {
            const {userId} : unFreezeAccountSchemaType  = req.params 

            if (userId&&req?.user?.role !==RoleType.admin) {
                throw new AppError("unauthorized" , 401);
            }

            const user = await this._userModel.findOneAndUpdate(
            {_id :userId , DeletedAt: { $ne: null } ,DeletedBy: { $ne: userId }  },
            {RestoreAt : new Date() ,RestoreBy : req.user?._id , $unset  : {DeletedAt : "" , DeletedBy: "" }})

                if (!user) {
                    throw new AppError("user not found " , 404);
                }

        return res.status(200).json({ message: "unFreeze success", })
    }

    updatePassword  = async (req: Request, res: Response, next: NextFunction) => {
        const {oldPassword , newPassword , confirmPassword} :updatePasswordSchemaType = req.body
        if (!req.user) {
            throw new AppError("Unauthorized" ,401);
        }


        if (!await Compare(oldPassword , req?.user?.password! )) {
            throw new AppError("Invalid Password" ,400);
        }

        const hash = await Hash(newPassword)

        req.user.password! = hash

        await req.user.save()
        if (!req.decoded) {
        throw new AppError("Invalid token", 401);
    }

        await this._RevokeModel.create({ 
            tokenId : req?.decoded?.jti!, 
            userId : req.user?._id! , 
            expireAt: new Date( req.decoded?.exp! *1000 )
        })


        return res.status(200).json({ message: "update success",user : req.user })
    }

    updateProfile = async (req: Request, res: Response, next: NextFunction) => {

        const { age , FName , LName} = req.body
        if (!req.user) {
            throw new AppError("Unauthorized" ,401);
        }
        req.user.age! = age
        req.user.FName! = FName
        req.user.LName! = LName
        await req.user.save()
        return res.status(200).json({ message: "update success",user : req.user })
    }

    updateEmail= async (req: Request, res: Response) => {
        const { newEmail } = req.body
        if (!newEmail) {
            throw new AppError("New email is required", 400);
        }
        const otp = generateOtp()
        const hashOtp = await Hash(String(otp))
        eventEmitter.emit("updateEmail", { email : req.user?.email , otp })
        await this._userModel.updateOne({email : req.user?.email} , 
            {emailChange : {newEmail , codeHash : hashOtp , expiresAt : new Date(Date.now() + 60 * 60 * 1000)}})

            await req.user?.save();

        return res.status(200).json({ message: "Email send confirm code" });
    }; 


    updateEmailConfirm = async (req: Request, res: Response) => {
        const { otp } = req.body as updateEmailConfirmSchemaType;
        const user = await this._userModel.findOne({
            email : req.user?.email,
            emailChange : { $exists: true }
        });
    
        if (!user) {
        throw new AppError("User not found or no pending email change", 404);
        }
    
        if (user.emailChange?.expiresAt && user.emailChange.expiresAt < new Date()) {
        throw new AppError("OTP expired", 400);
        }
    
        const isMatch = await Compare(otp, user.emailChange?.codeHash!);
        if (!isMatch) {
        throw new AppError("Invalid OTP", 400);
        }
        await this._userModel.updateOne(
        { _id: user._id },
        {
            $set: { email: user.emailChange?.newEmail },
            $unset: { emailChange: "" }
        }
        );
        return res.status(200).json({ message: "Email updated successfully" });
    };

    enableTwoFA = async (req: Request, res: Response) => {

        const { email } = req.body;
        const user = await this._userModel.findOne({ email });
        if (!user) {
        throw new AppError("User not found", 404);
        }
        
        const otp = generateOtp();
        const hashOtp = await Hash(String(otp));
        
        user.twoFA = {
        codeHash: hashOtp,
          expiresAt: new Date(Date.now() + 5 * 60 * 1000), // صالح 5 دقايق
        tries: 0,
        };
        await user.save();
        
        eventEmitter.emit("TwoFAEnable", { email, otp });
        
        return res.status(200).json({ message: "OTP sent to email" });
    };


    verifyTwoFA = async (req: Request, res: Response) => {
        const { otp } = req.body;
    
        const user = await this._userModel.findOne({ email: req.user?.email });
        if (!user) {
        throw new AppError("User not found", 404);
        }
        
        const isMatch = await Compare(otp, user.twoFA?.codeHash!);
        if (!isMatch) {
        throw new AppError("Invalid OTP", 400);
        }
        
        user.isTwoFAEnabled = true;
        await user.save();
        
        return res.status(200).json({ message: "2FA enabled successfully" });
    };

    confirmLoginTwoFA = async (req: Request, res: Response) => {

            const { email, otp } = req.body;
          
            const user = await this._userModel.findOne({ email });
            if (!user || !user.twoFA) return res.status(400).json({ message: "Invalid login flow" });
          
            const isMatch = await Compare(otp, user.twoFA?.codeHash!);
            if (!isMatch) {
            throw new AppError("Invalid OTP", 400);
            }
          
            user.twoFA = {
                codeHash: "",
                expiresAt: new Date(),
                tries: 0,
            };
            await user.save();
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
    
        
            return res.status(200).json({ message: "Login confirmed", accessToken , RefreshToken });
          
    };
}

export default new UserService()