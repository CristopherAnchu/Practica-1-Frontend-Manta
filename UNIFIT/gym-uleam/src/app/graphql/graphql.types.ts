// Tipos base
export interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  tipo: string;
  telefono?: string;
  cedula?: string;
  fechaRegistro: Date | string;
  activo: boolean;
  rol?: Rol;
  reservas?: Reserva[];
}

export interface Rol {
  id: number;
  nombre: string;
  descripcion?: string;
  permisos: string[];
  usuarios?: Usuario[];
}

export interface Rutina {
  id: number;
  nombre: string;
  descripcion: string;
  cupoMaximo: number;
  duracionMinutos: number;
  instructor?: string;
  nivel?: string;
  calificacionPromedio?: number;
  activa: boolean;
  reservas?: Reserva[];
}

export interface Reserva {
  id: number;
  fecha: Date | string;
  fechaCreacion: Date | string;
  estado: string;
  observaciones?: string;
  calificacion?: number;
  asistio: boolean;
  usuario: Usuario;
  rutina: Rutina;
}

// Inputs para mutations
export interface CreateUsuarioInput {
  nombre: string;
  correo: string;
  tipo: string;
  telefono?: string;
  cedula?: string;
  rolId?: number;
}

export interface UpdateUsuarioInput {
  nombre?: string;
  correo?: string;
  tipo?: string;
  telefono?: string;
  cedula?: string;
  activo?: boolean;
  rolId?: number;
}

export interface CreateRutinaInput {
  nombre: string;
  descripcion: string;
  cupoMaximo: number;
  duracionMinutos?: number;
  instructor?: string;
  nivel?: string;
}

export interface UpdateRutinaInput {
  nombre?: string;
  descripcion?: string;
  cupoMaximo?: number;
  duracionMinutos?: number;
  instructor?: string;
  nivel?: string;
  activa?: boolean;
}

export interface CreateReservaInput {
  fecha: string;
  usuarioId: number;
  rutinaId: number;
  observaciones?: string;
}

export interface UpdateReservaInput {
  fecha?: string;
  estado?: string;
  observaciones?: string;
  calificacion?: number;
  asistio?: boolean;
}

export interface CreateRolInput {
  nombre: string;
  descripcion?: string;
  permisos?: string[];
}

export interface UpdateRolInput {
  nombre?: string;
  descripcion?: string;
  permisos?: string[];
}

// Filtros
export interface UsuarioFilterInput {
  tipo?: string;
  activo?: boolean;
  rolId?: number;
}

export interface RutinaFilterInput {
  nivel?: string;
  activa?: boolean;
  instructor?: string;
}

export interface ReservaFilterInput {
  estado?: string;
  usuarioId?: number;
  rutinaId?: number;
  fechaInicio?: string;
  fechaFin?: string;
  asistio?: boolean;
}

// Tipos de reportes
export interface EstadisticasReservas {
  totalReservas: number;
  reservasActivas: number;
  reservasCanceladas: number;
  reservasFinalizadas: number;
  porcentajeAsistencia: number;
  calificacionPromedio: number;
}

export interface TendenciaReservas {
  fecha: string;
  totalReservas: number;
  reservasCreadas: number;
  reservasCanceladas: number;
  reservasCompletadas: number;
}

export interface ReporteOcupacion {
  rutinaId: number;
  nombreRutina: string;
  fecha: string;
  reservasActivas: number;
  cupoMaximo: number;
  porcentajeOcupacion: number;
  cuposDisponibles: number;
}

export interface UsuarioActivo {
  usuarioId: number;
  nombreUsuario: string;
  correo: string;
  tipo: string;
  totalReservas: number;
  reservasCompletadas: number;
  porcentajeAsistencia: number;
}

export interface RutinaPopular {
  rutinaId: number;
  nombreRutina: string;
  totalReservas: number;
  cupoMaximo: number;
  ocupacionPromedio: number;
  calificacionPromedio?: number;
}

export interface ResumenUsuario {
  usuarioId: number;
  nombre: string;
  correo: string;
  totalReservas: number;
  reservasProximas: number;
  reservasCompletadas: number;
  calificacionPromedio: number;
  ultimaReserva: string;
}

export interface DashboardData {
  estadisticas: EstadisticasReservas;
  topRutinas: RutinaPopular[];
  topUsuarios: UsuarioActivo[];
  ocupacion: ReporteOcupacion[];
}
