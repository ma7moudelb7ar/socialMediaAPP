"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const classError_1 = require("../../utils/security/error/classError");
const user_model_1 = __importDefault(require("../../dataBase/model/user.model"));
const user_Repository_1 = require("../../dataBase/Repository/user.Repository");
const hash_1 = require("../../utils/security/hash/hash");
const Event_1 = require("../../utils/event/Event");
const sendEmail_1 = require("../../service/sendEmail");
const GenerateToken_1 = require("../../utils/security/token/GenerateToken");
const uuid_1 = require("uuid");
const enumRole_1 = require("../../common/enum/enumRole");
const logDevices_1 = require("../../common/enum/logDevices");
const RevokeToken_Repository_1 = require("./../../dataBase/Repository/RevokeToken.Repository");
const revokeToken_1 = __importDefault(require("../../dataBase/model/revokeToken"));
const google_auth_library_1 = require("google-auth-library");
const ProviderType_1 = require("../../common/enum/ProviderType");
class UserService {
    _userModel = new user_Repository_1.userRepository(user_model_1.default);
    _RevokeModel = new RevokeToken_Repository_1.revokeTokenRepository(revokeToken_1.default);
    constructor() { }
    signUp = async (req, res, next) => {
        const { UserName, email, password, confirmPassword, phone, age, gender } = req.body;
        if (await this._userModel.findOne({ email })) {
            throw new classError_1.AppError("email already exist ", 409);
        }
        const hash = await (0, hash_1.Hash)(password);
        const otp = (0, sendEmail_1.generateOtp)();
        const hashOtp = await (0, hash_1.Hash)(String(otp));
        const user = await this._userModel.createOneUser({ UserName, email, otp: hashOtp, password: hash, phone, age, gender });
        Event_1.eventEmitter.emit("confirmEmail", { email, otp });
        return res.status(201).json({ message: "success", user });
    };
    confirmEmail = async (req, res, next) => {
        const { email, otp } = req.body;
        const user = await this._userModel.findOne({ email, confirmed: { $exists: false } });
        if (!user) {
            throw new classError_1.AppError("user not found or already exist", 404);
        }
        if (!await (0, hash_1.Compare)(otp, user?.otp)) {
            throw new classError_1.AppError("invalid otp", 400);
        }
        await this._userModel.updateOne({ email: user?.email }, { confirmed: true, $unset: { otp: " " } });
        return res.status(200).json({ message: "login success" });
    };
    signIn = async (req, res, next) => {
        const { email, password } = req.body;
        const user = await this._userModel.findOne({ email, confirmed: { $exists: true }, provider: ProviderType_1.ProviderType.system });
        if (!user) {
            throw new classError_1.AppError("user not found or not confirmed yet", 404);
        }
        if (!await (0, hash_1.Compare)(password, user?.password)) {
            throw new classError_1.AppError("Invalid password", 409);
        }
        const jwtid = (0, uuid_1.v4)();
        const accessToken = await (0, GenerateToken_1.GenerateToken)({
            payload: { id: user?._id, email: user?.email },
            signature: user.role === enumRole_1.RoleType.user ? process.env.SIGNATURE_USER_TOKEN : process.env.SIGNATURE_ADMIN_TOKEN,
            options: { expiresIn: 60 * 2, jwtid }
        });
        const RefreshToken = await (0, GenerateToken_1.GenerateToken)({
            payload: { id: user?._id, email: user?.email },
            signature: user.role === enumRole_1.RoleType.user ? process.env.REFRESH_SIGNATURE_USER_TOKEN : process.env.REFRESH_SIGNATURE_ADMIN_TOKEN,
            options: { expiresIn: "1y", jwtid }
        });
        return res.status(200).json({ message: "login success", accessToken, RefreshToken });
    };
    loginWithGmail = async (req, res, next) => {
        const { idToken } = req.body;
        const client = new google_auth_library_1.OAuth2Client();
        async function verify() {
            const ticket = await client.verifyIdToken({
                idToken,
                audience: process.env.WEB_CLIENT_ID,
            });
            const payload = ticket.getPayload();
            return payload;
        }
        const { name, picture, email_verified, email } = await verify();
        let user = await this._userModel.findOne({ email });
        if (!user) {
            user = await this._userModel.create({
                UserName: name,
                email: email,
                image: picture,
                confirmed: email_verified,
                provider: ProviderType_1.ProviderType.google,
            });
        }
        if (user?.provider === ProviderType_1.ProviderType.system) {
            throw new classError_1.AppError("please login with system", 400);
        }
        const jwtid = (0, uuid_1.v4)();
        const accessToken = await (0, GenerateToken_1.GenerateToken)({
            payload: { id: user?._id, email: user?.email },
            signature: user.role === enumRole_1.RoleType.user ? process.env.SIGNATURE_USER_TOKEN : process.env.SIGNATURE_ADMIN_TOKEN,
            options: { expiresIn: 60 * 2, jwtid }
        });
        const RefreshToken = await (0, GenerateToken_1.GenerateToken)({
            payload: { id: user?._id, email: user?.email },
            signature: user.role === enumRole_1.RoleType.user ? process.env.REFRESH_SIGNATURE_USER_TOKEN : process.env.REFRESH_SIGNATURE_ADMIN_TOKEN,
            options: { expiresIn: "1y", jwtid }
        });
        return res.status(200).json({ message: "login success", accessToken, RefreshToken });
    };
    Profile = async (req, res, next) => {
        return res.status(200).json({ message: "get profile success", user: req.user });
    };
    logout = async (req, res, next) => {
        const { flag } = req.body;
        if (flag === logDevices_1.logDevices?.all) {
            await this._userModel.updateOne({ _id: req.user?._id }, { changeCredentials: new Date() });
            return res.status(200).json({ message: "success logOut from all devises" });
        }
        if (flag === logDevices_1.logDevices?.current) {
            await this._RevokeModel.create({
                tokenId: req?.decoded?.jti,
                userId: req.user?._id,
                expireAt: new Date(req.decoded?.exp * 1000)
            });
        }
        return res.status(200).json({ message: "success logOut from this devise" });
    };
    RefreshToken = async (req, res, next) => {
        const jwtid = (0, uuid_1.v4)();
        const accessToken = await (0, GenerateToken_1.GenerateToken)({
            payload: { id: req?.user?._id, email: req?.user?.email },
            signature: req?.user?.role === enumRole_1.RoleType.user ? process.env.SIGNATURE_USER_TOKEN : process.env.SIGNATURE_ADMIN_TOKEN,
            options: { expiresIn: 60 * 2, jwtid }
        });
        const RefreshToken = await (0, GenerateToken_1.GenerateToken)({
            payload: { id: req?.user?._id, email: req?.user?.email },
            signature: req?.user?.role === enumRole_1.RoleType.user ? process.env.REFRESH_SIGNATURE_USER_TOKEN : process.env.REFRESH_SIGNATURE_ADMIN_TOKEN,
            options: { expiresIn: "1y", jwtid }
        });
        await this._RevokeModel.create({
            tokenId: req?.decoded?.jti,
            userId: req.user?._id,
            expireAt: new Date(req.decoded?.exp * 1000)
        });
        return res.status(200).json({ message: "get profile success", accessToken, RefreshToken });
    };
    ForgetPassword = async (req, res, next) => {
        const { email } = req.body;
        const user = await this._userModel.findOne({ email, confirmed: { $exists: true } });
        if (!user) {
            throw new classError_1.AppError("user not found or not confirmed ", 404);
        }
        const otp = (0, sendEmail_1.generateOtp)();
        const hashOtp = await (0, hash_1.Hash)(String(otp));
        Event_1.eventEmitter.emit("ForgetPassword", { email, otp });
        await this._userModel.updateOne({ email: user?.email }, { otp: hashOtp });
        return res.status(200).json({ message: "send Code success", });
    };
    resetPassword = async (req, res, next) => {
        const { otp, email, password, confirmPassword } = req.body;
        const user = await this._userModel.findOne({ email, otp: { $exists: true } });
        if (!user) {
            throw new classError_1.AppError("user not found  ", 404);
        }
        if (!await (0, hash_1.Compare)(otp, user?.otp)) {
            throw new classError_1.AppError("Invalid Otp ", 400);
        }
        const hashPassword = await (0, hash_1.Hash)(password);
        await this._userModel.updateOne({ email: user?.email }, { password: hashPassword, $unset: { otp: " " } });
        return res.status(200).json({ message: "reset Password Success", });
    };
}
exports.default = new UserService();
