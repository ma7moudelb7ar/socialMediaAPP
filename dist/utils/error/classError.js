"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
class AppError extends Error {
    message;
    statuscode;
    constructor(message, statuscode) {
        super(message);
        this.message = message;
        this.statuscode = statuscode;
    }
}
exports.AppError = AppError;
