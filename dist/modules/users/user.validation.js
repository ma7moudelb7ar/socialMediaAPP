"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordSchema = exports.ForgetPasswordSchema = exports.logoutSchema = exports.confirmEmailSchema = exports.loginWithGmailSchema = exports.SignUpSchema = exports.signInSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const enumGender_1 = require("../../common/enum/enumGender");
const logDevices_1 = require("../../common/enum/logDevices");
exports.signInSchema = {
    body: zod_1.default.object({
        email: zod_1.default.email(),
        password: zod_1.default.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
    }).required()
};
exports.SignUpSchema = {
    body: exports.signInSchema.body.extend({
        UserName: zod_1.default.string().min(2).max(20),
        confirmPassword: zod_1.default.string(),
        age: zod_1.default.number().min(18).max(60),
        phone: zod_1.default.string(),
        gender: zod_1.default.enum([enumGender_1.GenderType.male, enumGender_1.GenderType.female])
    }).required().refine((data) => {
        return data.password === data.confirmPassword;
    }, {
        message: "Passwords don't match",
        path: ["confirm"],
    })
};
exports.loginWithGmailSchema = {
    body: zod_1.default.object({
        idToken: zod_1.default.string()
    }).required()
};
exports.confirmEmailSchema = {
    body: zod_1.default.object({
        otp: zod_1.default.string().regex(/^\d{6}$/, 'OTP must be 6 digits'),
        email: zod_1.default.email(),
    }).required()
};
exports.logoutSchema = {
    body: zod_1.default.object({
        flag: zod_1.default.enum([logDevices_1.logDevices.all, logDevices_1.logDevices.current])
    }).required()
};
exports.ForgetPasswordSchema = {
    body: zod_1.default.object({
        email: zod_1.default.email(),
    }).required()
};
exports.resetPasswordSchema = {
    body: exports.signInSchema.body.extend({
        confirmPassword: zod_1.default.string(),
        otp: zod_1.default.string().regex(/^\d{6}$/, 'OTP must be 6 digits'),
    }).required().refine((data) => {
        return data.password === data.confirmPassword;
    }, {
        message: "Passwords don't match",
        path: ["confirm"],
    })
};
