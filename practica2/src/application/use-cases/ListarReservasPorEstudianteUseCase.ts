import type { Reserva } from "../../domain/entities"
import type { IReservaRepository } from "../../domain/repositories"

export class ListarReservasPorEstudianteUseCase {
  constructor(private readonly reservaRepository: IReservaRepository) {}

  async ejecutar(estudianteId: string): Promise<Reserva[]> {
    if (!estudianteId || estudianteId.trim() === "") {
      throw new Error("El ID del estudiante es requerido")
    }

    return await this.reservaRepository.listarPorEstudiante(estudianteId)
  }
}
