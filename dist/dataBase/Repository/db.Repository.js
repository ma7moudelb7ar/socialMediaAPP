"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbRepository = void 0;
class dbRepository {
    model;
    constructor(model) {
        this.model = model;
    }
    async create(data) {
        return this.model.create(data);
    }
    async findOne(filter, select) {
        return this.model.findOne(filter, select);
    }
}
exports.dbRepository = dbRepository;
