export interface CrearReservaDto {
  estudianteId: string
  nombreEstudiante: string
  emailEstudiante: string
  fecha: string // ISO 8601 format
  horaInicio: string // HH:MM format
  horaFin: string // HH:MM format
  capacidadUtilizada?: number
  notas?: string
}

export interface ActualizarReservaDto {
  horaInicio?: string
  horaFin?: string
  notas?: string
  estado?: "activa" | "cancelada" | "completada"
}

export interface ReservaResponseDto {
  id: string
  estudianteId: string
  nombreEstudiante: string
  emailEstudiante: string
  fecha: string
  horaInicio: string
  horaFin: string
  estado: string
  capacidadUtilizada: number
  duracionMinutos: number
  notas?: string
  creadoEn: string
  actualizadoEn: string
}
