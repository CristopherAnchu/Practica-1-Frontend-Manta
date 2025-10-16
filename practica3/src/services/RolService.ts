import { AppDataSource } from "../data-source";
import { Rol } from "../entities/Rol";

export class RolService {
  private repo = AppDataSource.getRepository(Rol);

  async create(data: Partial<Rol>) {
    return this.repo.save(data);
  }

  async findAll() {
    return this.repo.find({ relations: ["usuarios"] });
  }

  async findOne(id: number) {
    return this.repo.findOne({ where: { id }, relations: ["usuarios"] });
  }

  async update(id: number, data: Partial<Rol>) {
    await this.repo.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.repo.delete(id);
  }
}