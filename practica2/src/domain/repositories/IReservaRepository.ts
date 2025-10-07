import type { Reserva } from "../entities"

export interface IReservaRepository {
  // Usando callbacks
  crear(reserva: Reserva, callback: (error: Error | null, reserva?: Reserva) => void): void

  // Usando promises
  obtenerPorId(id: string): Promise<Reserva | null>

  // Usando async/await
  listarPorEstudiante(estudianteId: string): Promise<Reserva[]>
  listarPorFecha(fecha: Date): Promise<Reserva[]>
  listarActivas(): Promise<Reserva[]>
  actualizar(id: string, reserva: Reserva): Promise<Reserva>
  eliminar(id: string): Promise<boolean>

  // Verificar disponibilidad
  verificarDisponibilidad(fecha: Date, horaInicio: string, horaFin: string): Promise<boolean>
}
