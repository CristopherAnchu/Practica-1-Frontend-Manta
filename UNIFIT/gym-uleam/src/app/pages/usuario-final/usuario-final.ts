import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import flatpickr from 'flatpickr';
import Swal from 'sweetalert2';
import { ReservaService } from '../../services/reserva.service';
import { AuthService } from '../../services/auth.service';
import { Reserva } from '../../models/reserva.model';
import { firstValueFrom } from 'rxjs';

// Tipado simple para evitar problemas con exportaciones de tipos de flatpickr
type FlatpickrInstance = any;
type FlatpickrOptions = any;

interface RutinaPredefinida {
  nombre: string;
  ejercicios: Array<{ ejercicio: string; series: string; repeticiones: string }>;
}

@Component({
  selector: 'app-usuario-final',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuario-final.html',
  styleUrls: ['./usuario-final.css']
})
export class UsuarioFinal implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('fechaInput', { static: false }) fechaInput!: ElementRef<HTMLInputElement>;
  private fpInstance?: FlatpickrInstance;

  view: 'reservar' | 'misReservas' | 'rutinas' | 'incidencias' = 'reservar';

  minDate: string;
  
  // Incidencias
  incidenciaForm = {
    asunto: '',
    descripcion: '',
    prioridad: 'MEDIA' as 'BAJA' | 'MEDIA' | 'ALTA'
  };
  fechaSeleccionada: string | null = null;
  horarioSeleccionado: string | null = null;
  duracion: number | null = null;
  creandoReserva: boolean = false; // Prevenir doble click

  horariosDisponibles: { hora: string, reservado: boolean }[] = [];

  reservas: Reserva[] = [];
  reservasUsuario: Reserva[] = [];
  usuarioActual: string = ''; // id o email del usuario

  rutinasPredefinidas: RutinaPredefinida[] = [
    {
      nombre: 'Día de Piernas',
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
      nombre: 'Día de Pecho',
      ejercicios: [
        { ejercicio: 'Press de banca plano', series: '4', repeticiones: '8-12' },
        { ejercicio: 'Press inclinado con mancuernas', series: '4', repeticiones: '10-12' },
        { ejercicio: 'Aperturas con mancuernas', series: '3', repeticiones: '12-15' },
        { ejercicio: 'Fondos en paralelas', series: '3', repeticiones: '10-15' },
        { ejercicio: 'Pullover con mancuerna', series: '3', repeticiones: '12-15' }
      ]
    },
    {
      nombre: 'Día de Espalda',
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
      nombre: 'Día de Hombros',
      ejercicios: [
        { ejercicio: 'Press militar con barra', series: '4', repeticiones: '8-12' },
        { ejercicio: 'Elevaciones laterales', series: '4', repeticiones: '12-15' },
        { ejercicio: 'Elevaciones frontales', series: '3', repeticiones: '12-15' },
        { ejercicio: 'Pájaros con mancuernas', series: '3', repeticiones: '12-15' },
        { ejercicio: 'Encogimientos con barra', series: '3', repeticiones: '12-15' }
      ]
    },
    {
      nombre: 'Día de Brazos',
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
      nombre: 'Día de Core/Abdomen',
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

  private reservaSvc = inject(ReservaService);
  private auth = inject(AuthService);
  private router = inject(Router);

  constructor() {
    this.minDate = new Date().toISOString().split('T')[0];
  }

  async ngOnInit(): Promise<void> {
    const usuario = this.auth.getCurrentUser();
    this.usuarioActual = (usuario && ((usuario as any).id || (usuario as any).email)) || 'usuario@demo.com';
    try {
      const reservasData = await firstValueFrom(this.reservaSvc.list());
      this.reservas = Array.isArray(reservasData) ? reservasData : [];
    } catch (error) {
      console.error('Error cargando reservas:', error);
      this.reservas = [];
    }
    this.cargarReservasUsuario();
  }

  ngAfterViewInit(): void {
    this.initializeFlatpickr();
  }

  initializeFlatpickr(): void {
    // Esperar un poco para asegurar que el DOM está listo
    setTimeout(() => {
      if (this.fechaInput && this.fechaInput.nativeElement) {
        // Destruir instancia previa si existe
        if (this.fpInstance) {
          this.fpInstance.destroy();
        }

        const options: FlatpickrOptions = {
          dateFormat: "Y-m-d",
          minDate: this.minDate,
          locale: {
            firstDayOfWeek: 1,
            weekdays: {
              shorthand: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
              longhand: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
            },
            months: {
              shorthand: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
              longhand: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
            }
          },
          inline: false,
          disableMobile: true,
          onChange: (selectedDates: Date[], dateStr: string) => {
            this.fechaSeleccionada = dateStr || null;
            this.horarioSeleccionado = null;
            this.duracion = null;
            this.generarHorariosDisponibles();
          }
        };
        
        this.fpInstance = flatpickr(this.fechaInput.nativeElement, options);
      }
    }, 100);
  }

  // Getter para usar en la plantilla en lugar de lambdas
  get reservasDelDia(): Reserva[] {
    if (!this.fechaSeleccionada) return [];
    return this.reservas.filter(x => x.fecha === this.fechaSeleccionada);
  }

  get hayReservasEnFecha(): boolean {
    if (!this.fechaSeleccionada) return false;
    return this.reservas.some(x => x.fecha === this.fechaSeleccionada);
  }

  mostrarReservar() {
    this.view = 'reservar';
    this.resetSeleccion();
    // Reinicializar flatpickr cuando se muestra la vista
    setTimeout(() => this.initializeFlatpickr(), 150);
  }

  mostrarMisReservas() {
    this.view = 'misReservas';
    this.cargarReservasUsuario();
  }

  mostrarRutinas() {
    this.view = 'rutinas';
  }

  mostrarIncidencias() {
    this.view = 'incidencias';
  }

  enviarIncidencia() {
    // Validación
    if (!this.incidenciaForm.asunto.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Asunto requerido',
        text: 'Por favor, ingresa un asunto para la incidencia.',
        confirmButtonColor: '#667eea'
      });
      return;
    }

    if (!this.incidenciaForm.descripcion.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Descripción requerida',
        text: 'Por favor, describe la incidencia.',
        confirmButtonColor: '#667eea'
      });
      return;
    }

    // Crear incidencia
    const nuevaIncidencia = {
      id: Date.now().toString(),
      usuarioId: this.usuarioActual,
      asunto: this.incidenciaForm.asunto,
      descripcion: this.incidenciaForm.descripcion,
      prioridad: this.incidenciaForm.prioridad,
      estado: 'PENDIENTE' as const,
      fecha: new Date().toISOString(),
      respuesta: null
    };

    // Guardar en localStorage
    const incidencias = JSON.parse(localStorage.getItem('incidencias') || '[]');
    incidencias.push(nuevaIncidencia);
    localStorage.setItem('incidencias', JSON.stringify(incidencias));

    // Limpiar formulario
    this.incidenciaForm = {
      asunto: '',
      descripcion: '',
      prioridad: 'MEDIA'
    };

    // Confirmación
    Swal.fire({
      icon: 'success',
      title: '¡Incidencia enviada!',
      text: 'Tu reporte ha sido registrado. El equipo lo revisará pronto.',
      confirmButtonColor: '#667eea',
      confirmButtonText: 'Entendido'
    });
  }

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
      this.auth.logout();
      await Swal.fire({
        icon: 'success',
        title: 'Sesión cerrada',
        text: 'Hasta pronto',
        timer: 1500,
        showConfirmButton: false
      });
      this.router.navigate(['/login']);
    }
  }

  onFechaSeleccionadaManual(value: string | null) {
    this.fechaSeleccionada = value;
    this.horarioSeleccionado = null;
    this.duracion = null;
    this.generarHorariosDisponibles();
  }

  generarHorariosDisponibles() {
    const horarios: string[] = [];
    for (let h = 8; h <= 15; h++) {
      horarios.push(h.toString().padStart(2, '0') + ':00');
    }

    const duracionSeleccion = this.duracion ?? 1;

    this.horariosDisponibles = horarios.map(hora => {
      const horaNum = parseInt(hora.split(':')[0], 10);

      const ocupado = this.reservas.some(r => {
        if (r.fecha !== this.fechaSeleccionada) return false;
        const reservaInicio = parseInt((r.hora || '00:00').split(':')[0], 10);
        const reservaFin = reservaInicio + (r.duracion || 1);
        const slotInicio = horaNum;
        const slotFin = slotInicio + duracionSeleccion;
        return (slotInicio < reservaFin) && (slotFin > reservaInicio);
      });

      return { hora, reservado: ocupado };
    });
  }

  onHorarioSeleccionado(hora: string) {
    this.horarioSeleccionado = hora;
  }

  async confirmarReserva() {
    // Prevenir doble click
    if (this.creandoReserva) {
      return;
    }
    
    if (!this.fechaSeleccionada || !this.horarioSeleccionado || !this.duracion) {
      await Swal.fire({
        icon: 'warning',
        title: 'Datos incompletos',
        text: 'Por favor selecciona fecha, hora y duración.'
      });
      return;
    }

    this.creandoReserva = true;

    try {
      const horaNum = parseInt(this.horarioSeleccionado.split(':')[0], 10);
      const duracion = this.duracion ?? 1;

      // Recargar reservas antes de validar para tener datos frescos
      const reservasActuales = await firstValueFrom(this.reservaSvc.list());
      this.reservas = Array.isArray(reservasActuales) ? reservasActuales : [];
      
      const solapado = this.reservas.some((r: Reserva) => {
        if (r.fecha !== this.fechaSeleccionada) return false;
        const reservaInicio = parseInt((r.hora || '00:00').split(':')[0], 10);
        const reservaFin = reservaInicio + (r.duracion || 1);
        const slotInicio = horaNum;
        const slotFin = slotInicio + duracion;
        return (slotInicio < reservaFin) && (slotFin > reservaInicio);
      });

      if (solapado) {
        await Swal.fire({
          icon: 'error',
          title: 'Horario no disponible',
          text: 'El horario seleccionado se cruza con otra reserva.'
        });
        return;
      }

      const nuevaReserva: any = {
        fecha: this.fechaSeleccionada,
        hora: this.horarioSeleccionado,
        duracion: duracion,
        estado: 'PENDIENTE'
      };

      await this.reservaSvc.create(nuevaReserva);
      
      // Recargar reservas después de crear exitosamente
      const reservasActualizadas = await firstValueFrom(this.reservaSvc.list());
      this.reservas = Array.isArray(reservasActualizadas) ? reservasActualizadas : [];
      this.cargarReservasUsuario();
      
      await Swal.fire({
        icon: 'success',
        title: '¡Reserva confirmada!',
        text: `Tu reserva para el ${this.fechaSeleccionada} a las ${this.horarioSeleccionado} ha sido creada exitosamente.`,
        confirmButtonText: 'Entendido'
      });
      
      this.resetSeleccion();
      this.generarHorariosDisponibles();
      
    } catch (error: any) {
      // Recargar reservas incluso si hay error
      try {
        const reservasActualizadas = await firstValueFrom(this.reservaSvc.list());
        this.reservas = Array.isArray(reservasActualizadas) ? reservasActualizadas : [];
        this.cargarReservasUsuario();
        this.generarHorariosDisponibles();
      } catch (e) {
        console.error('Error recargando reservas:', e);
      }
      
      await Swal.fire({
        icon: 'error',
        title: 'Error al crear reserva',
        text: error?.message || 'No se pudo crear la reserva. Por favor intenta nuevamente.',
        confirmButtonText: 'Entendido'
      });
    } finally {
      this.creandoReserva = false;
    }
  }  cargarReservasUsuario() {
    this.reservasUsuario = this.reservas.filter(r => r.usuarioId === this.usuarioActual);
  }

  async cancelarReserva(reserva: Reserva) {
    const result = await Swal.fire({
      title: '¿Cancelar reserva?',
      text: `¿Estás seguro que deseas cancelar la reserva del ${reserva.fecha} a las ${reserva.hora}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No',
      confirmButtonColor: '#dc3545'
    });

    if (!result.isConfirmed) return;

    try {
      await this.reservaSvc.delete(reserva.id);
      
      // Recargar reservas con validación
      const reservasActualizadas = await firstValueFrom(this.reservaSvc.list());
      this.reservas = Array.isArray(reservasActualizadas) ? reservasActualizadas : [];
      this.cargarReservasUsuario();
      
      await Swal.fire({
        icon: 'success',
        title: 'Reserva cancelada',
        text: 'La reserva ha sido cancelada exitosamente.',
        timer: 2000,
        showConfirmButton: false
      });

      if (this.fechaSeleccionada === reserva.fecha) this.generarHorariosDisponibles();
      
    } catch (error: any) {
      console.error('Error cancelando reserva:', error);
      
      // Recargar reservas incluso si hay error
      try {
        const reservasActualizadas = await firstValueFrom(this.reservaSvc.list());
        this.reservas = Array.isArray(reservasActualizadas) ? reservasActualizadas : [];
        this.cargarReservasUsuario();
      } catch (e) {
        console.error('Error recargando reservas:', e);
      }
      
      await Swal.fire({
        icon: 'error',
        title: 'Error al cancelar',
        text: error?.message || 'No se pudo cancelar la reserva. Por favor intenta nuevamente.',
        confirmButtonText: 'Entendido'
      });
    }
  }

  sumarHoras(hora: string, duracion: number): string {
    const h = parseInt(hora.split(':')[0], 10);
    return (h + duracion).toString().padStart(2, '0') + ':00';
  }

  resetSeleccion() {
    this.fechaSeleccionada = null;
    this.horarioSeleccionado = null;
    this.duracion = null;
    this.horariosDisponibles = [];
    if (this.fpInstance) this.fpInstance.clear();
  }

  // Métodos para Mis Reservas
  getDaysUntil(fecha: string): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const reservaDate = new Date(fecha);
    reservaDate.setHours(0, 0, 0, 0);
    const diffTime = reservaDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  getProximasReservas(): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.reservasUsuario.filter(r => {
      const reservaDate = new Date(r.fecha);
      reservaDate.setHours(0, 0, 0, 0);
      return reservaDate >= today;
    }).length;
  }

  getTotalHoras(): number {
    return this.reservasUsuario.reduce((total, r) => total + (r.duracion || 1), 0);
  }

  async verDetalleReserva(reserva: Reserva) {
    const diasRestantes = this.getDaysUntil(reserva.fecha);
    const horaInicio = reserva.hora || '00:00';
    const duracionHoras = reserva.duracion || 1;
    let mensaje = `
      <div style="text-align: left;">
        <p><strong>📅 Fecha:</strong> ${reserva.fecha}</p>
        <p><strong>🕐 Horario:</strong> ${horaInicio} - ${this.sumarHoras(horaInicio, duracionHoras)}</p>
        <p><strong>⏱️ Duración:</strong> ${duracionHoras} hora(s)</p>
        <p><strong>📍 Estado:</strong> ${reserva.estado || 'PENDIENTE'}</p>
    `;
    
    if (diasRestantes >= 0) {
      if (diasRestantes === 0) {
        mensaje += `<p><strong>⏰ ¡Tu reserva es hoy!</strong></p>`;
      } else if (diasRestantes === 1) {
        mensaje += `<p><strong>⏰ Tu reserva es mañana</strong></p>`;
      } else {
        mensaje += `<p><strong>⏰ Faltan ${diasRestantes} días</strong></p>`;
      }
    }
    
    mensaje += '</div>';

    await Swal.fire({
      title: 'Detalle de Reserva',
      html: mensaje,
      icon: 'info',
      confirmButtonText: 'Entendido',
      confirmButtonColor: '#667eea'
    });
  }

  ngOnDestroy(): void {
    // Limpiar instancia de flatpickr al destruir el componente
    if (this.fpInstance) {
      this.fpInstance.destroy();
    }
  }
}