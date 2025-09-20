"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const enumGender_1 = require("../../common/enum/enumGender");
const enumRole_1 = require("../../common/enum/enumRole");
const ProviderType_1 = require("../../common/enum/ProviderType");
const userSchema = new mongoose_1.default.Schema({
    FName: { type: String, required: true, min: 2, max: 10, trim: true },
    LName: { type: String, required: true, min: 2, max: 5, trim: true },
    password: { type: String, required: function () {
            return this.provider === ProviderType_1.ProviderType.google ? false : true;
        }, },
    image: { type: String },
    email: { type: String, required: true, unique: true },
    age: { type: Number, min: 18, max: 60, required: function () {
            return this.provider === ProviderType_1.ProviderType.google ? false : true;
        } },
    phone: { type: String },
    address: { type: String },
    gender: { type: String, enum: enumGender_1.GenderType, required: function () {
            return this.provider === ProviderType_1.ProviderType.google ? false : true;
        } },
    otp: { type: String },
    role: { type: String, enum: enumRole_1.RoleType, default: enumRole_1.RoleType.user },
    provider: { type: String, enum: ProviderType_1.ProviderType, default: ProviderType_1.ProviderType.system },
    confirmed: { type: Boolean },
    changeCredentials: { type: Date }
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
userSchema.pre("save", async function (next) {
    console.log("---------------------pre -------------------------");
    console.log(this);
});
userSchema.post("save", function () {
    console.log("---------------------post -------------------------");
    console.log(this);
});
const userModel = mongoose_1.default.models.User || mongoose_1.default.model("User", userSchema);
exports.default = userModel;
