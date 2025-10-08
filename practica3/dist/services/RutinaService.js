"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RutinaService = void 0;
const data_source_1 = require("../data-source");
const Rutina_1 = require("../entities/Rutina");
class RutinaService {
    constructor() {
        this.repo = data_source_1.AppDataSource.getRepository(Rutina_1.Rutina);
    }
    async create(data) {
        return this.repo.save(data);
    }
    async findAll() {
        return this.repo.find({ relations: ["reservas"] });
    }
    async findOne(id) {
        return this.repo.findOne({ where: { id }, relations: ["reservas"] });
    }
    async update(id, data) {
        await this.repo.update(id, data);
        return this.findOne(id);
    }
    async remove(id) {
        await this.repo.delete(id);
    }
}
exports.RutinaService = RutinaService;
