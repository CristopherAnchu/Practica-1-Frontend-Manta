"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuarioService = void 0;
const data_source_1 = require("../data-source");
const Usuario_1 = require("../entities/Usuario");
class UsuarioService {
    constructor() {
        this.repo = data_source_1.AppDataSource.getRepository(Usuario_1.Usuario);
    }
    async create(data) { return this.repo.save(data); }
    async findAll() { return this.repo.find({ relations: ["rol", "reservas"] }); }
    async findOne(id) { return this.repo.findOne({ where: { id }, relations: ["rol", "reservas"] }); }
    async update(id, data) { await this.repo.update(id, data); return this.findOne(id); }
    async remove(id) { await this.repo.delete(id); }
}
exports.UsuarioService = UsuarioService;
