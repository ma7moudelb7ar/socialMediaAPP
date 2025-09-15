"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)({ path: (0, path_1.resolve)("./config/.env") });
const express_1 = __importDefault(require("express"));
const express_rate_limit_1 = require("express-rate-limit");
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const classError_1 = require("./utils/security/error/classError");
const user_controller_1 = __importDefault(require("./modules/users/user.controller"));
const GlobalError_1 = require("./middlewares/GlobalError");
const connectionDB_1 = __importDefault(require("./dataBase/connectionDB"));
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
const limiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 5 * 60 * 1000,
    limit: 10,
    message: {
        error: "Game Over........🤦‍♂️"
    },
    statusCode: 429,
    legacyHeaders: false
});
const bootstrap = () => {
    app.use(express_1.default.json());
    app.use((0, cors_1.default)());
    app.use((0, helmet_1.default)());
    app.use(limiter);
    app.get("/", (req, res, next) => {
        return res.status(200).json({ message: "welcome My SocailMediaApp......✌❤" });
    });
    app.use("/user", user_controller_1.default);
    app.use("{/*demo}", (req, res, next) => {
        throw new classError_1.AppError(` Url not found  ${req.originalUrl}`, 404);
    });
    (0, connectionDB_1.default)();
    app.use(GlobalError_1.GlobalError);
    app.listen(port, () => {
        console.log(`server is ruining ${port}...✌❤ `);
    });
};
exports.default = bootstrap;
