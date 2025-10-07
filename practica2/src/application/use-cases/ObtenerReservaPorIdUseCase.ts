import type { Reserva } from "../../domain/entities"
import type { IReservaRepository } from "../../domain/repositories"

export class ObtenerReservaPorIdUseCase {
  constructor(private readonly reservaRepository: IReservaRepository) {}

  async ejecutar(id: string): Promise<Reserva> {
    if (!id || id.trim() === "") {
      throw new Error("El ID de la reserva es requerido")
    }

    const reserva = await this.reservaRepository.obtenerPorId(id)

    if (!reserva) {
      throw new Error(`No se encontró la reserva con ID ${id}`)
    }

    return reserva
  }
}
