export interface User {
  id: string;
  nombre?: string;
  email: string;
  password?: string;
  tipo?: 'CLIENTE' | 'ADMINISTRADOR' | 'OTRO';
  rol?: 'CLIENTE' | 'ADMINISTRADOR';
  telefono?: string;
  createdAt?: string;
}
