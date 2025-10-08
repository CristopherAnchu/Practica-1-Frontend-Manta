"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolService = void 0;
const data_source_1 = require("../data-source");
const Rol_1 = require("../entities/Rol");
class RolService {
    constructor() {
        this.repo = data_source_1.AppDataSource.getRepository(Rol_1.Rol);
    }
    async create(data) {
        return this.repo.save(data);
    }
    async findAll() {
        return this.repo.find({ relations: ["usuarios"] });
    }
    async findOne(id) {
        return this.repo.findOne({ where: { id }, relations: ["usuarios"] });
    }
    async update(id, data) {
        await this.repo.update(id, data);
        return this.findOne(id);
    }
    async remove(id) {
        await this.repo.delete(id);
    }
}
exports.RolService = RolService;
