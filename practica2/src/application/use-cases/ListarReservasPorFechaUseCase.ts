import type { Reserva } from "../../domain/entities"
import type { IReservaRepository } from "../../domain/repositories"

export class ListarReservasPorFechaUseCase {
  constructor(private readonly reservaRepository: IReservaRepository) {}

  async ejecutar(fecha: Date): Promise<Reserva[]> {
    if (!fecha) {
      throw new Error("La fecha es requerida")
    }

    return await this.reservaRepository.listarPorFecha(fecha)
  }
}
