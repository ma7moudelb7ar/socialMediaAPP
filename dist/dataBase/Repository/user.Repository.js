"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRepository = void 0;
const db_Repository_1 = require("./db.Repository");
const classError_1 = require("../../utils/security/error/classError");
class userRepository extends db_Repository_1.dbRepository {
    model;
    constructor(model) {
        super(model);
        this.model = model;
    }
    async createOneUser(data) {
        const user = await this.model.create(data);
        if (!user) {
            throw new classError_1.AppError(" fail to create", 400);
        }
        return user;
    }
}
exports.userRepository = userRepository;
