import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GenericDataService } from '../../services/generic-data.service';
import { LocalStorageAdapter } from '../../services/local-storage-adapter.service';
import { AuthService } from '../../services/auth.service';
import { ReservaService } from '../../services/reserva.service';
import { RutinaService } from '../../services/rutina.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { Reserva } from '../../models/reserva.model';
import { firstValueFrom } from 'rxjs';
import Swal from 'sweetalert2';

interface Equipo {
  id: string;
  nombre: string;
  tipo: string;
  estado: 'DISPONIBLE' | 'MANTENIMIENTO' | 'FUERA_SERVICIO';
  imagen?: string;
}

interface Rutina {
  id: string;
  nombre: string;
  descripcion: string;
  nivel: 'PRINCIPIANTE' | 'INTERMEDIO' | 'AVANZADO';
  ejercicios: Array<{
    ejercicio: string;
    series: string;
    repeticiones: string;
  }>;
}

interface Asistencia {
  id: string;
  reservaId: string;
  usuarioId: string;
  fecha: string;
  asistio: boolean;
  observaciones?: string;
}

interface Incidencia {
  id: string;
  usuarioId: string;
  asunto: string;
  descripcion: string;
  prioridad: 'BAJA' | 'MEDIA' | 'ALTA';
  estado?: 'PENDIENTE' | 'EN_PROCESO' | 'RESUELTA';
  fecha: string;
}

@Component({
  selector: 'app-administrador',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './administrador.html',
  styleUrls: ['./administrador.css']
})
export class Administrador implements OnInit {
  view: 'dashboard' | 'reservas' | 'usuarios' | 'asistencias' | 'equipos' | 'rutinas' | 'incidencias' = 'dashboard';

  // Services
  private userService = inject(UserService);
  private reservaService = inject(ReservaService);
  private rutinaService = inject(RutinaService); // Para rutinas de usuarios (HTTP)
  private rutinasAdminService = new GenericDataService<Rutina>(new LocalStorageAdapter<Rutina>('rutinasAdmin')); // Plantillas de administrador
  private equiposService = new GenericDataService<Equipo>(new LocalStorageAdapter<Equipo>('equipos'));
  private asistenciasService = new GenericDataService<Asistencia>(new LocalStorageAdapter<Asistencia>('asistencias'));
  private incidenciasService = new GenericDataService<Incidencia>(new LocalStorageAdapter<Incidencia>('incidencias'));

  // Data
  usuarios: User[] = [];
  reservas: Reserva[] = [];
  equipos: Equipo[] = [];
  rutinas: Rutina[] = [];
  asistencias: Asistencia[] = [];
  incidencias: Incidencia[] = [];

  // Dashboard stats
  usersCount = 0;
  reservasCount = 0;
  equiposCount = 0;
  asistenciasCount = 0;

  // Forms
  usuarioEditando: User | null = null;

  private router = inject(Router);
  private authService = inject(AuthService);

  async ngOnInit(): Promise<void> {
    await this.cargarDatos();
  }

  async cargarDatos() {
    try {
      // Usar servicios HTTP para obtener datos del backend
      this.usuarios = await firstValueFrom(this.userService.list());
      this.reservas = await firstValueFrom(this.reservaService.list());
      
      // Rutinas de administrador (plantillas) se mantienen en LocalStorage
      this.rutinas = await this.rutinasAdminService.list() as any;
      
      // Mantener LocalStorage para equipos, asistencias e incidencias por ahora
      this.equipos = await this.equiposService.list() as any;
      this.asistencias = await this.asistenciasService.list() as any;
      this.incidencias = await this.incidenciasService.list() as any;

      this.usersCount = this.usuarios.length;
      this.reservasCount = this.reservas.length;
      this.equiposCount = this.equipos.length;
      this.asistenciasCount = this.asistencias.filter(a => a.asistio).length;
      
      console.log('📊 Dashboard cargado - Reservas:', this.reservasCount, this.reservas);
    } catch (error) {
      console.error('❌ Error cargando datos del dashboard:', error);
      Swal.fire('Error', 'No se pudieron cargar los datos del dashboard', 'error');
    }

    // Inicializar equipos si no hay
    if (this.equipos.length === 0) {
      await this.inicializarEquipos();
    }

    // Inicializar rutinas si no hay
    if (this.rutinas.length === 0) {
      await this.inicializarRutinas();
    }
  }

  async inicializarEquipos() {
    const equiposIniciales: Equipo[] = [
      { id: '1', nombre: 'Cinta de correr Pro', tipo: 'Cardio', estado: 'DISPONIBLE' },
      { id: '2', nombre: 'Bicicleta estática', tipo: 'Cardio', estado: 'DISPONIBLE' },
      { id: '3', nombre: 'Máquina de remo', tipo: 'Cardio', estado: 'DISPONIBLE' },
      { id: '4', nombre: 'Press de banca', tipo: 'Fuerza', estado: 'DISPONIBLE' },
      { id: '5', nombre: 'Rack de sentadillas', tipo: 'Fuerza', estado: 'DISPONIBLE' },
      { id: '6', nombre: 'Máquina de pesas', tipo: 'Fuerza', estado: 'MANTENIMIENTO' }
    ];

    for (const equipo of equiposIniciales) {
      await this.equiposService.create(equipo);
    }
    this.equipos = await this.equiposService.list() as any;
  }

  async inicializarRutinas() {
    const rutinasIniciales: Rutina[] = [
      {
        id: '1',
        nombre: 'Día de Piernas',
        descripcion: 'Rutina completa para el desarrollo de piernas',
        nivel: 'INTERMEDIO',
        ejercicios: [
          { ejercicio: 'Sentadillas con barra', series: '4', repeticiones: '8-12' },
          { ejercicio: 'Prensa de piernas', series: '4', repeticiones: '10-15' },
          { ejercicio: 'Peso muerto rumano', series: '3', repeticiones: '10-12' },
          { ejercicio: 'Extensiones de cuádriceps', series: '3', repeticiones: '12-15' },
          { ejercicio: 'Curl de piernas', series: '3', repeticiones: '12-15' },
          { ejercicio: 'Elevación de pantorrillas', series: '4', repeticiones: '15-20' }
        ]
      },
      {
        id: '2',
        nombre: 'Día de Pecho',
        descripcion: 'Entrenamiento enfocado en el desarrollo del pectoral',
        nivel: 'INTERMEDIO',
        ejercicios: [
          { ejercicio: 'Press de banca plano', series: '4', repeticiones: '8-12' },
          { ejercicio: 'Press inclinado con mancuernas', series: '4', repeticiones: '10-12' },
          { ejercicio: 'Aperturas con mancuernas', series: '3', repeticiones: '12-15' },
          { ejercicio: 'Fondos en paralelas', series: '3', repeticiones: '10-15' },
          { ejercicio: 'Pullover con mancuerna', series: '3', repeticiones: '12-15' }
        ]
      },
      {
        id: '3',
        nombre: 'Día de Espalda',
        descripcion: 'Rutina completa para la musculatura dorsal',
        nivel: 'AVANZADO',
        ejercicios: [
          { ejercicio: 'Peso muerto convencional', series: '4', repeticiones: '6-10' },
          { ejercicio: 'Dominadas', series: '4', repeticiones: '8-12' },
          { ejercicio: 'Remo con barra', series: '4', repeticiones: '10-12' },
          { ejercicio: 'Remo con mancuerna', series: '3', repeticiones: '10-12' },
          { ejercicio: 'Jalón al pecho', series: '3', repeticiones: '12-15' },
          { ejercicio: 'Face pulls', series: '3', repeticiones: '15-20' }
        ]
      },
      {
        id: '4',
        nombre: 'Día de Hombros',
        descripcion: 'Desarrollo completo de deltoides',
        nivel: 'INTERMEDIO',
        ejercicios: [
          { ejercicio: 'Press militar con barra', series: '4', repeticiones: '8-12' },
          { ejercicio: 'Elevaciones laterales', series: '4', repeticiones: '12-15' },
          { ejercicio: 'Elevaciones frontales', series: '3', repeticiones: '12-15' },
          { ejercicio: 'Pájaros con mancuernas', series: '3', repeticiones: '12-15' },
          { ejercicio: 'Encogimientos con barra', series: '3', repeticiones: '12-15' }
        ]
      },
      {
        id: '5',
        nombre: 'Día de Brazos',
        descripcion: 'Entrenamiento específico para bíceps y tríceps',
        nivel: 'PRINCIPIANTE',
        ejercicios: [
          { ejercicio: 'Curl con barra', series: '4', repeticiones: '10-12' },
          { ejercicio: 'Curl martillo', series: '3', repeticiones: '12-15' },
          { ejercicio: 'Curl concentrado', series: '3', repeticiones: '12-15' },
          { ejercicio: 'Press francés', series: '4', repeticiones: '10-12' },
          { ejercicio: 'Extensiones en polea', series: '3', repeticiones: '12-15' },
          { ejercicio: 'Fondos entre bancos', series: '3', repeticiones: '12-15' }
        ]
      },
      {
        id: '6',
        nombre: 'Día de Core/Abdomen',
        descripcion: 'Fortalecimiento del core y abdominales',
        nivel: 'PRINCIPIANTE',
        ejercicios: [
          { ejercicio: 'Plancha frontal', series: '3', repeticiones: '45-60 seg' },
          { ejercicio: 'Plancha lateral', series: '3', repeticiones: '30-45 seg' },
          { ejercicio: 'Crunches', series: '4', repeticiones: '15-20' },
          { ejercicio: 'Elevación de piernas', series: '3', repeticiones: '12-15' },
          { ejercicio: 'Russian twists', series: '3', repeticiones: '20-30' },
          { ejercicio: 'Mountain climbers', series: '3', repeticiones: '20-30' }
        ]
      }
    ];

    for (const rutina of rutinasIniciales) {
      await this.rutinasAdminService.create(rutina);
    }
    this.rutinas = await this.rutinasAdminService.list() as any;
  }

  // Navigation
  mostrarDashboard() { this.view = 'dashboard'; }
  mostrarReservas() { this.view = 'reservas'; this.cargarDatos(); }
  mostrarUsuarios() { this.view = 'usuarios'; this.cargarDatos(); }
  mostrarAsistencias() { this.view = 'asistencias'; this.cargarDatos(); }
  mostrarEquipos() { this.view = 'equipos'; this.cargarDatos(); }
  mostrarRutinas() { this.view = 'rutinas'; this.cargarDatos(); }
  mostrarIncidencias() { this.view = 'incidencias'; this.cargarDatos(); }

  // Reservas
  getUsuarioNombre(usuarioId: string): string {
    const user = this.usuarios.find(u => u.id === usuarioId || u.email === usuarioId);
    return user ? (user.nombre || 'Sin nombre') : 'Usuario desconocido';
  }

  async confirmarReserva(reserva: Reserva) {
    const result = await Swal.fire({
      title: '¿Confirmar reserva?',
      text: `Confirmar reserva de ${this.getUsuarioNombre(reserva.usuarioId)} para el ${reserva.fecha}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, confirmar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#667eea'
    });

    if (result.isConfirmed) {
      try {
        reserva.estado = 'CONFIRMADA';
        await this.reservaService.update(reserva.id, reserva);
        await this.cargarDatos();
        
        Swal.fire({
          icon: 'success',
          title: 'Reserva confirmada',
          text: 'La reserva ha sido confirmada exitosamente',
          confirmButtonColor: '#667eea',
          timer: 2000
        });
      } catch (error) {
        console.error('❌ Error confirmando reserva:', error);
        Swal.fire('Error', 'No se pudo confirmar la reserva', 'error');
      }
    }
  }

  async cancelarReserva(reserva: Reserva) {
    const result = await Swal.fire({
      title: '¿Cancelar reserva?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No',
      confirmButtonColor: '#f5576c'
    });

    if (result.isConfirmed) {
      try {
        await this.reservaService.delete(reserva.id);
        await this.cargarDatos();
        
        Swal.fire({
          icon: 'success',
          title: 'Reserva cancelada',
          timer: 2000,
          showConfirmButton: false
        });
      } catch (error) {
        console.error('❌ Error cancelando reserva:', error);
        Swal.fire('Error', 'No se pudo cancelar la reserva', 'error');
      }
    }
  }

  // Usuarios
  editarUsuario(usuario: User) {
    this.usuarioEditando = { ...usuario };
  }

  async guardarUsuario() {
    if (!this.usuarioEditando) return;

    if (!this.usuarioEditando.nombre || !this.usuarioEditando.email) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos requeridos',
        text: 'Por favor completa todos los campos',
        confirmButtonColor: '#667eea'
      });
      return;
    }

    try {
      await this.userService.update(this.usuarioEditando.id, this.usuarioEditando);
      await this.cargarDatos();
      this.usuarioEditando = null;

      Swal.fire({
        icon: 'success',
        title: 'Usuario actualizado',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('❌ Error actualizando usuario:', error);
      Swal.fire('Error', 'No se pudo actualizar el usuario', 'error');
    }
  }

  cancelarEdicion() {
    this.usuarioEditando = null;
  }

  // Asistencias
  getReservaInfo(reservaId: string): string {
    const reserva = this.reservas.find(r => r.id === reservaId);
    if (!reserva) return 'Reserva no encontrada';
    return `${reserva.fecha} a las ${reserva.hora}`;
  }

  async marcarAsistencia(reserva: Reserva, asistio: boolean) {
    const asistenciaExistente = this.asistencias.find(a => a.reservaId === reserva.id);

    if (asistenciaExistente) {
      asistenciaExistente.asistio = asistio;
      await this.asistenciasService.update(asistenciaExistente.id, asistenciaExistente);
    } else {
      const nuevaAsistencia: Asistencia = {
        id: Date.now().toString(),
        reservaId: reserva.id,
        usuarioId: reserva.usuarioId,
        fecha: reserva.fecha,
        asistio: asistio
      };
      await this.asistenciasService.create(nuevaAsistencia);
    }

    await this.cargarDatos();

    Swal.fire({
      icon: 'success',
      title: asistio ? 'Asistencia registrada' : 'Inasistencia registrada',
      timer: 1500,
      showConfirmButton: false
    });
  }

  verificarAsistencia(reservaId: string): boolean | null {
    const asistencia = this.asistencias.find(a => a.reservaId === reservaId);
    return asistencia ? asistencia.asistio : null;
  }

  // Equipos
  nuevoEquipo = { nombre: '', tipo: '', estado: 'DISPONIBLE' as 'DISPONIBLE' | 'MANTENIMIENTO' | 'FUERA_SERVICIO' };

  async cambiarEstadoEquipo(equipo: Equipo, nuevoEstado: 'DISPONIBLE' | 'MANTENIMIENTO' | 'FUERA_SERVICIO') {
    equipo.estado = nuevoEstado;
    await this.equiposService.update(equipo.id, equipo);
    await this.cargarDatos();

    Swal.fire({
      icon: 'success',
      title: 'Estado actualizado',
      timer: 1500,
      showConfirmButton: false
    });
  }

  async agregarEquipo() {
    if (!this.nuevoEquipo.nombre || !this.nuevoEquipo.tipo) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos requeridos',
        text: 'Por favor completa el nombre y tipo del equipo',
        confirmButtonColor: '#667eea'
      });
      return;
    }

    const equipo: Equipo = {
      id: Date.now().toString(),
      nombre: this.nuevoEquipo.nombre,
      tipo: this.nuevoEquipo.tipo,
      estado: this.nuevoEquipo.estado
    };

    await this.equiposService.create(equipo);
    await this.cargarDatos();
    
    // Resetear formulario
    this.nuevoEquipo = { nombre: '', tipo: '', estado: 'DISPONIBLE' };

    Swal.fire({
      icon: 'success',
      title: 'Equipo agregado',
      timer: 2000,
      showConfirmButton: false
    });
  }

  // Incidencias
  async cambiarEstadoIncidencia(incidencia: Incidencia, nuevoEstado: 'PENDIENTE' | 'EN_PROCESO' | 'RESUELTA') {
    incidencia.estado = nuevoEstado;
    await this.incidenciasService.update(incidencia.id, incidencia);
    await this.cargarDatos();

    Swal.fire({
      icon: 'success',
      title: 'Estado actualizado',
      timer: 1500,
      showConfirmButton: false
    });
  }

  async eliminarIncidencia(incidencia: Incidencia) {
    const result = await Swal.fire({
      title: '¿Eliminar incidencia?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#f5576c'
    });

    if (result.isConfirmed) {
      await this.incidenciasService.delete(incidencia.id);
      await this.cargarDatos();
      
      Swal.fire({
        icon: 'success',
        title: 'Incidencia eliminada',
        timer: 2000,
        showConfirmButton: false
      });
    }
  }

  // Logout
  async cerrarSesion() {
    const result = await Swal.fire({
      title: '¿Cerrar sesión?',
      text: '¿Estás seguro que deseas salir?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, salir',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc3545'
    });

    if (result.isConfirmed) {
      this.authService.logout();
      this.router.navigate(['/login']);
    }
  }
}
