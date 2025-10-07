import type { ReservaService } from "../../application/services"
import type { CrearReservaDto, ActualizarReservaDto } from "../../application/dtos"

export class ReservaController {
  constructor(private readonly reservaService: ReservaService) {}

  async crearReserva(dto: CrearReservaDto): Promise<void> {
    try {
      console.log("\n=== Creando nueva reserva ===")
      const reserva = await this.reservaService.crearReserva(dto)
      console.log("✅ Reserva creada exitosamente:", reserva)
    } catch (error) {
      console.error("❌ Error al crear reserva:", (error as Error).message)
      throw error
    }
  }

  async listarReservasActivas(): Promise<void> {
    try {
      console.log("\n=== Listando reservas activas ===")
      const reservas = await this.reservaService.listarReservasActivas()
      console.log(`✅ Se encontraron ${reservas.length} reservas activas:`)
      reservas.forEach((reserva) => {
        console.log(
          `  - ${reserva.nombreEstudiante} | ${reserva.fecha.split("T")[0]} | ${reserva.horaInicio}-${reserva.horaFin}`,
        )
      })
    } catch (error) {
      console.error("❌ Error al listar reservas activas:", (error as Error).message)
      throw error
    }
  }

  async listarReservasPorEstudiante(estudianteId: string): Promise<void> {
    try {
      console.log(`\n=== Listando reservas del estudiante ${estudianteId} ===`)
      const reservas = await this.reservaService.listarReservasPorEstudiante(estudianteId)
      console.log(`✅ Se encontraron ${reservas.length} reservas:`)
      reservas.forEach((reserva) => {
        console.log(
          `  - ${reserva.fecha.split("T")[0]} | ${reserva.horaInicio}-${reserva.horaFin} | Estado: ${reserva.estado}`,
        )
      })
    } catch (error) {
      console.error("❌ Error al listar reservas por estudiante:", (error as Error).message)
      throw error
    }
  }

  async listarReservasPorFecha(fecha: Date): Promise<void> {
    try {
      console.log(`\n=== Listando reservas para ${fecha.toISOString().split("T")[0]} ===`)
      const reservas = await this.reservaService.listarReservasPorFecha(fecha)
      console.log(`✅ Se encontraron ${reservas.length} reservas:`)
      reservas.forEach((reserva) => {
        console.log(
          `  - ${reserva.nombreEstudiante} | ${reserva.horaInicio}-${reserva.horaFin} | ${reserva.duracionMinutos} min`,
        )
      })
    } catch (error) {
      console.error("❌ Error al listar reservas por fecha:", (error as Error).message)
      throw error
    }
  }

  async obtenerReservaPorId(id: string): Promise<void> {
    try {
      console.log(`\n=== Obteniendo reserva ${id} ===`)
      const reserva = await this.reservaService.obtenerReservaPorId(id)
      console.log("✅ Reserva encontrada:", reserva)
    } catch (error) {
      console.error("❌ Error al obtener reserva:", (error as Error).message)
      throw error
    }
  }

  async actualizarReserva(id: string, dto: ActualizarReservaDto): Promise<void> {
    try {
      console.log(`\n=== Actualizando reserva ${id} ===`)
      const reserva = await this.reservaService.actualizarReserva(id, dto)
      console.log("✅ Reserva actualizada exitosamente:", reserva)
    } catch (error) {
      console.error("❌ Error al actualizar reserva:", (error as Error).message)
      throw error
    }
  }

  async cancelarReserva(id: string): Promise<void> {
    try {
      console.log(`\n=== Cancelando reserva ${id} ===`)
      const reserva = await this.reservaService.cancelarReserva(id)
      console.log("✅ Reserva cancelada exitosamente:", reserva)
    } catch (error) {
      console.error("❌ Error al cancelar reserva:", (error as Error).message)
      throw error
    }
  }

  async verificarDisponibilidad(fecha: Date, horaInicio: string, horaFin: string): Promise<void> {
    try {
      console.log(`\n=== Verificando disponibilidad ===`)
      console.log(`Fecha: ${fecha.toISOString().split("T")[0]}`)
      console.log(`Horario: ${horaInicio} - ${horaFin}`)

      const disponible = await this.reservaService.verificarDisponibilidad(fecha, horaInicio, horaFin)

      if (disponible) {
        console.log("✅ El horario está disponible")
      } else {
        console.log("❌ El horario NO está disponible")
      }
    } catch (error) {
      console.error("❌ Error al verificar disponibilidad:", (error as Error).message)
      throw error
    }
  }
}
