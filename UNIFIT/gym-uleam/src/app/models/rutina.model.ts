export interface Rutina {
  id: string;
  usuarioId: string;
  titulo: string;
  descripcion?: string;
  ejercicios?: Array<{ nombre: string; repeticiones?: string }>;
  createdAt?: string;
}
