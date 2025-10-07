import { Reserva } from "../../domain/entities"
import type { IReservaRepository } from "../../domain/repositories"

export class ReservaRepositoryInMemory implements IReservaRepository {
  private reservas: Map<string, Reserva> = new Map()

  constructor() {
    this.inicializarDatosPrueba()
  }

  private inicializarDatosPrueba(): void {
    const hoy = new Date()
    const manana = new Date(hoy)
    manana.setDate(manana.getDate() + 1)

    const reserva1 = new Reserva(
      "1",
      "EST001",
      "Juan Pérez",
      "juan.perez@universidad.edu",
      hoy,
      "08:00",
      "09:30",
      "activa",
      1,
      "Primera sesión de la semana",
    )

    const reserva2 = new Reserva(
      "2",
      "EST002",
      "María García",
      "maria.garcia@universidad.edu",
      hoy,
      "10:00",
      "11:00",
      "activa",
      1,
    )

    const reserva3 = new Reserva(
      "3",
      "EST001",
      "Juan Pérez",
      "juan.perez@universidad.edu",
      manana,
      "14:00",
      "15:30",
      "activa",
      1,
      "Entrenamiento de fuerza",
    )

    this.reservas.set(reserva1.id, reserva1)
    this.reservas.set(reserva2.id, reserva2)
    this.reservas.set(reserva3.id, reserva3)
  }

  crear(reserva: Reserva, callback: (error: Error | null, reserva?: Reserva) => void): void {
    setTimeout(() => {
      try {
        if (this.reservas.has(reserva.id)) {
          callback(new Error(`Ya existe una reserva con el ID ${reserva.id}`))
          return
        }

        this.reservas.set(reserva.id, reserva)
        callback(null, reserva)
      } catch (error) {
        callback(error as Error)
      }
    }, 100)
  }

  async obtenerPorId(id: string): Promise<Reserva | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const reserva = this.reservas.get(id)
        resolve(reserva || null)
      }, 50)
    })
  }

  async listarPorEstudiante(estudianteId: string): Promise<Reserva[]> {
    return Array.from(this.reservas.values()).filter((reserva) => reserva.estudianteId === estudianteId)
  }

  async listarPorFecha(fecha: Date): Promise<Reserva[]> {
    const fechaBusqueda = new Date(fecha.setHours(0, 0, 0, 0))
    return Array.from(this.reservas.values()).filter((reserva) => {
      const fechaReserva = new Date(reserva.fecha.setHours(0, 0, 0, 0))
      return fechaReserva.getTime() === fechaBusqueda.getTime()
    })
  }

  async listarActivas(): Promise<Reserva[]> {
    return Array.from(this.reservas.values()).filter((reserva) => reserva.estado === "activa")
  }

  async actualizar(id: string, reservaActualizada: Reserva): Promise<Reserva> {
    if (!this.reservas.has(id)) {
      throw new Error(`No se encontró la reserva con ID ${id}`)
    }

    this.reservas.set(id, reservaActualizada)
    return reservaActualizada
  }

  async eliminar(id: string): Promise<boolean> {
    if (!this.reservas.has(id)) {
      throw new Error(`No se encontró la reserva con ID ${id}`)
    }

    return this.reservas.delete(id)
  }

  async verificarDisponibilidad(fecha: Date, horaInicio: string, horaFin: string): Promise<boolean> {
    const reservasDelDia = await this.listarPorFecha(fecha)

    const [inicioH, inicioM] = horaInicio.split(":").map(Number)
    const [finH, finM] = horaFin.split(":").map(Number)
    const minutosInicio = inicioH * 60 + inicioM
    const minutosFin = finH * 60 + finM

    // Verificar que no haya conflictos con reservas activas
    for (const reserva of reservasDelDia) {
      if (reserva.estado !== "activa") continue

      const [resInicioH, resInicioM] = reserva.horaInicio.split(":").map(Number)
      const [resFinH, resFinM] = reserva.horaFin.split(":").map(Number)
      const resMinutosInicio = resInicioH * 60 + resInicioM
      const resMinutosFin = resFinH * 60 + resFinM

      // Verificar solapamiento
      if (
        (minutosInicio >= resMinutosInicio && minutosInicio < resMinutosFin) ||
        (minutosFin > resMinutosInicio && minutosFin <= resMinutosFin) ||
        (minutosInicio <= resMinutosInicio && minutosFin >= resMinutosFin)
      ) {
        return false // Hay conflicto
      }
    }

    return true // No hay conflictos
  }
}
