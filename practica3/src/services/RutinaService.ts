import { AppDataSource } from "../data-source";
import { Rutina } from "../entities/Rutina";

export class RutinaService {
  private repo = AppDataSource.getRepository(Rutina);

  async create(data: Partial<Rutina>) {
    return this.repo.save(data);
  }

  async findAll() {
    return this.repo.find({ relations: ["reservas"] });
  }

  async findOne(id: number) {
    return this.repo.findOne({ where: { id }, relations: ["reservas"] });
  }

  async update(id: number, data: Partial<Rutina>) {
    await this.repo.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.repo.delete(id);
  }
}