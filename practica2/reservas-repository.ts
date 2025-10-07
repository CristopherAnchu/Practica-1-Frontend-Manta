import type { Reserva, CrearReservaInput } from "./types"

export class ReservasRepository {
  private reservas: Reserva[] = [
    {
      id: "1",
      estudianteId: "EST001",
      nombreEstudiante: "Juan Pérez",
      fecha: "2025-02-10",
      horaInicio: "08:00",
      horaFin: "09:00",
      estado: "activa",
      creadaEn: new Date("2025-02-01"),
    },
    {
      id: "2",
      estudianteId: "EST002",
      nombreEstudiante: "María García",
      fecha: "2025-02-10",
      horaInicio: "10:00",
      horaFin: "11:30",
      estado: "activa",
      creadaEn: new Date("2025-02-02"),
    },
  ]

  async crear(input: CrearReservaInput): Promise<Reserva> {
    // Validar que la hora de fin sea después de la hora de inicio
    if (input.horaInicio >= input.horaFin) {
      throw new Error("La hora de fin debe ser después de la hora de inicio")
    }

    // Verificar conflictos de horario
    const hayConflicto = this.reservas.some(
      (r) =>
        r.estado === "activa" &&
        r.fecha === input.fecha &&
        ((input.horaInicio >= r.horaInicio && input.horaInicio < r.horaFin) ||
          (input.horaFin > r.horaInicio && input.horaFin <= r.horaFin) ||
          (input.horaInicio <= r.horaInicio && input.horaFin >= r.horaFin)),
    )

    if (hayConflicto) {
      throw new Error("Ya existe una reserva en ese horario")
    }

    const nuevaReserva: Reserva = {
      id: Date.now().toString(),
      ...input,
      estado: "activa",
      creadaEn: new Date(),
    }

    this.reservas.push(nuevaReserva)
    return nuevaReserva
  }

  async listarPorFecha(fecha: string): Promise<Reserva[]> {
    return this.reservas.filter((r) => r.fecha === fecha && r.estado === "activa")
  }

  async listarPorEstudiante(estudianteId: string): Promise<Reserva[]> {
    return this.reservas.filter((r) => r.estudianteId === estudianteId && r.estado === "activa")
  }

  async obtenerPorId(id: string): Promise<Reserva | null> {
    return this.reservas.find((r) => r.id === id) || null
  }

  async cancelar(id: string): Promise<void> {
    const reserva = this.reservas.find((r) => r.id === id)
    if (!reserva) {
      throw new Error("Reserva no encontrada")
    }
    reserva.estado = "cancelada"
  }

  async listarTodas(): Promise<Reserva[]> {
    return this.reservas
  }
}
