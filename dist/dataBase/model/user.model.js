"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const enumGender_1 = require("../../common/enum/enumGender");
const enumRole_1 = require("../../common/enum/enumRole");
const userSchema = new mongoose_1.default.Schema({
    FName: { type: String,
        required: true,
        min: 2, max: 10,
        trim: true },
    LName: { type: String,
        required: true,
        min: 2, max: 5,
        trim: true },
    password: { type: String,
        required: true, },
    email: { type: String,
        required: true,
        unique: true },
    age: { type: Number,
        required: true,
        min: 18, max: 60 },
    phone: { type: String, required: true },
    address: { type: String },
    gender: { type: String, enum: enumGender_1.GenderType, required: true },
    role: { type: String, enum: enumRole_1.RoleType, default: enumRole_1.RoleType.user },
}, {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});
userSchema.virtual("UserName").set(function (value) {
    const [FName, LName] = value.split(" ");
    this.set({ FName, LName });
}).get(function () {
    return this.FName + " " + this.LName;
});
const userModel = mongoose_1.default.models.User || mongoose_1.default.model("User", userSchema);
exports.default = userModel;
