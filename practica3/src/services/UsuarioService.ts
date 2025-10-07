import { AppDataSource } from "../data-source";
import { Usuario } from "../entities/Usuario";

export class UsuarioService {
  private repo = AppDataSource.getRepository(Usuario);

  async create(data: Partial<Usuario>) { return this.repo.save(data); }
  async findAll() { return this.repo.find({ relations: ["rol", "reservas"] }); }
  async findOne(id: number) { return this.repo.findOne({ where: { id }, relations: ["rol", "reservas"] }); }
  async update(id: number, data: Partial<Usuario>) { await this.repo.update(id, data); return this.findOne(id); }
  async remove(id: number) { await this.repo.delete(id); }
}