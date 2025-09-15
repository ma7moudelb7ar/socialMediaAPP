"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalError = void 0;
const GlobalError = (err, req, res, next) => {
    return res.status(err.statuscode || 500).json({
        message: err.message,
        stack: err.stack,
        error: err
    });
};
exports.GlobalError = GlobalError;
