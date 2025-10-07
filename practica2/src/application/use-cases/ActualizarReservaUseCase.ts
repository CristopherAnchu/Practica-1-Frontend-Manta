import type { Reserva } from "../../domain/entities"
import type { IReservaRepository } from "../../domain/repositories"
import type { ActualizarReservaDto } from "../dtos"
import { ReservaMapper } from "../mappers"

export class ActualizarReservaUseCase {
  constructor(private readonly reservaRepository: IReservaRepository) {}

  async ejecutar(id: string, dto: ActualizarReservaDto): Promise<Reserva> {
    if (!id || id.trim() === "") {
      throw new Error("El ID de la reserva es requerido")
    }

    // Obtener reserva existente
    const reservaExistente = await this.reservaRepository.obtenerPorId(id)

    if (!reservaExistente) {
      throw new Error(`No se encontró la reserva con ID ${id}`)
    }

    // Si se está actualizando el horario, verificar disponibilidad
    if (dto.horaInicio && dto.horaFin) {
      const disponible = await this.reservaRepository.verificarDisponibilidad(
        reservaExistente.fecha,
        dto.horaInicio,
        dto.horaFin,
      )

      if (!disponible) {
        throw new Error("El nuevo horario no está disponible")
      }
    }

    // Actualizar entidad
    const reservaActualizada = ReservaMapper.updateEntity(reservaExistente, dto)

    // Guardar cambios
    return await this.reservaRepository.actualizar(id, reservaActualizada)
  }
}
