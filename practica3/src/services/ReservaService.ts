import { AppDataSource } from "../data-source";
import { Reserva } from "../entities/Reserva";

export class ReservaService {
  private repo = AppDataSource.getRepository(Reserva);

  async create(data: Partial<Reserva>) {
    return this.repo.save(data);
  }

  async findAll() {
    return this.repo.find({ relations: ["usuario", "actividad"] });
  }

  async findOne(id: number) {
    return this.repo.findOne({ where: { id }, relations: ["usuario", "actividad"] });
  }

  async update(id: number, data: Partial<Reserva>) {
    await this.repo.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.repo.delete(id);
  }
}