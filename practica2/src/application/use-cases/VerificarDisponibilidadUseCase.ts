import type { IReservaRepository } from "../../domain/repositories"

export class VerificarDisponibilidadUseCase {
  constructor(private readonly reservaRepository: IReservaRepository) {}

  async ejecutar(fecha: Date, horaInicio: string, horaFin: string): Promise<boolean> {
    if (!fecha) {
      throw new Error("La fecha es requerida")
    }

    if (!horaInicio || !horaFin) {
      throw new Error("Las horas de inicio y fin son requeridas")
    }

    return await this.reservaRepository.verificarDisponibilidad(fecha, horaInicio, horaFin)
  }
}
