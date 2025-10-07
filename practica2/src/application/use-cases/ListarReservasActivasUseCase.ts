import type { Reserva } from "../../domain/entities"
import type { IReservaRepository } from "../../domain/repositories"

export class ListarReservasActivasUseCase {
  constructor(private readonly reservaRepository: IReservaRepository) {}

  async ejecutar(): Promise<Reserva[]> {
    return await this.reservaRepository.listarActivas()
  }
}
