export interface Reserva {
  id: string
  estudianteId: string
  nombreEstudiante: string
  fecha: string // YYYY-MM-DD
  horaInicio: string // HH:MM
  horaFin: string // HH:MM
  estado: "activa" | "cancelada"
  creadaEn: Date
}

export interface CrearReservaInput {
  estudianteId: string
  nombreEstudiante: string
  fecha: string
  horaInicio: string
  horaFin: string
}
