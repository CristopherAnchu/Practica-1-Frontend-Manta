export interface Reserva {
  id: string;
  usuarioId: string;
  equipoId?: string;
  horarioId?: string;
  fecha: string; // ISO date
  hora?: string; // optional time like '08:00'
  duracion?: number;
  estado?: 'PENDIENTE' | 'CONFIRMADA' | 'CANCELADA';
  createdAt?: string;
}
