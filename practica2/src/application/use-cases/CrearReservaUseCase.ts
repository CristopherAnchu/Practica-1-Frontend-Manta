import type { Reserva } from "../../domain/entities"
import type { IReservaRepository } from "../../domain/repositories"
import type { CrearReservaDto } from "../dtos"
import { ReservaMapper } from "../mappers"

export class CrearReservaUseCase {
  constructor(private readonly reservaRepository: IReservaRepository) {}

  async ejecutar(dto: CrearReservaDto): Promise<Reserva> {
    // Verificar disponibilidad
    const disponible = await this.reservaRepository.verificarDisponibilidad(
      new Date(dto.fecha),
      dto.horaInicio,
      dto.horaFin,
    )

    if (!disponible) {
      throw new Error("El horario seleccionado no está disponible")
    }

    // Generar ID único
    const id = `RES-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    // Crear entidad
    const reserva = ReservaMapper.toEntity(dto, id)

    // Guardar en repositorio usando callback
    return new Promise((resolve, reject) => {
      this.reservaRepository.crear(reserva, (error, reservaCreada) => {
        if (error) {
          reject(error)
        } else {
          resolve(reservaCreada!)
        }
      })
    })
  }
}
