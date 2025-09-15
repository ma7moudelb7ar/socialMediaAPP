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
class UserService {
    _userModel = new user_Repository_1.userRepository(user_model_1.default);
    constructor() { }
    signUp = async (req, res, next) => {
        const { UserName, email, password, confirmPassword, phone, age, gender } = req.body;
        if (await this._userModel.findOne({ email })) {
            throw new classError_1.AppError("email already exist ", 409);
        }
        const hash = await (0, hash_1.Hash)(password);
        const user = await this._userModel.createOneUser({ UserName, email, password: hash, phone, age, gender });
        Event_1.eventEmitter.emit("confirmEmail", { email });
        return res.status(201).json({ message: "success", user });
    };
    signIn = (req, res, next) => {
        return res.status(200).json({ message: "login success" });
    };
}
exports.default = new UserService();
