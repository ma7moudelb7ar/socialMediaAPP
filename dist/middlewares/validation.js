"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validation = void 0;
const classError_1 = require("../utils/security/error/classError");
const validation = (schema) => {
    return (req, res, next) => {
        const validationErrors = [];
        for (const key of Object.keys(schema)) {
            if (!schema[key])
                continue;
            const result = schema[key].safeParse(req[key]);
            if (!result.success) {
                validationErrors.push(result.error);
            }
        }
        if (validationErrors.length) {
            throw new classError_1.AppError(JSON.parse(validationErrors), 400);
        }
        next();
    };
};
exports.validation = validation;
