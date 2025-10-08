"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservaService = void 0;
const data_source_1 = require("../data-source");
const Reserva_1 = require("../entities/Reserva");
class ReservaService {
    constructor() {
        this.repo = data_source_1.AppDataSource.getRepository(Reserva_1.Reserva);
    }
    async create(data) {
        return this.repo.save(data);
    }
    async findAll() {
        return this.repo.find({ relations: ["usuario", "actividad"] });
    }
    async findOne(id) {
        return this.repo.findOne({ where: { id }, relations: ["usuario", "actividad"] });
    }
    async update(id, data) {
        await this.repo.update(id, data);
        return this.findOne(id);
    }
    async remove(id) {
        await this.repo.delete(id);
    }
}
exports.ReservaService = ReservaService;
