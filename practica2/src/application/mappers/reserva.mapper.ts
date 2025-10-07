import { Reserva } from "../../domain/entities"
import type { CrearReservaDto, ActualizarReservaDto, ReservaResponseDto } from "../dtos"

export class ReservaMapper {
  static toEntity(dto: CrearReservaDto, id: string): Reserva {
    return new Reserva(
      id,
      dto.estudianteId,
      dto.nombreEstudiante,
      dto.emailEstudiante,
      new Date(dto.fecha),
      dto.horaInicio,
      dto.horaFin,
      "activa",
      dto.capacidadUtilizada || 1,
      dto.notas,
    )
  }

  static toResponseDto(reserva: Reserva): ReservaResponseDto {
    return {
      id: reserva.id,
      estudianteId: reserva.estudianteId,
      nombreEstudiante: reserva.nombreEstudiante,
      emailEstudiante: reserva.emailEstudiante,
      fecha: reserva.fecha.toISOString(),
      horaInicio: reserva.horaInicio,
      horaFin: reserva.horaFin,
      estado: reserva.estado,
      capacidadUtilizada: reserva.capacidadUtilizada,
      duracionMinutos: reserva.getDuracionEnMinutos(),
      notas: reserva.notas ?? "",
      creadoEn: reserva.creadoEn.toISOString(),
      actualizadoEn: reserva.actualizadoEn.toISOString(),
    }
  }

  static updateEntity(reserva: Reserva, dto: ActualizarReservaDto): Reserva {
    if (dto.horaInicio && dto.horaFin) {
      reserva.actualizarHorario(dto.horaInicio, dto.horaFin)
    }

    if (dto.notas !== undefined) {
      reserva.actualizarNotas(dto.notas)
    }

    if (dto.estado) {
      reserva.actualizarEstado(dto.estado)
    }

    return reserva
  }
}
