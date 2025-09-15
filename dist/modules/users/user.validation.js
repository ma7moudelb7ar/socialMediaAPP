"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignUpSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const enumGender_1 = require("../../common/enum/enumGender");
exports.SignUpSchema = {
    body: zod_1.default.object({
        UserName: zod_1.default.string().min(2).max(20),
        email: zod_1.default.email(),
        password: zod_1.default.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
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
