"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const connectionDB = async () => {
    mongoose_1.default.connect(process.env.DB_URI)
        .then(() => {
        console.log(`success to connect ${process.env.DB_URI}..........❤✌`);
    })
        .catch((error) => {
        console.log(`fail to connect ${process.env.DB_URI}........🤦‍♂️🙃`);
    });
};
exports.default = connectionDB;
