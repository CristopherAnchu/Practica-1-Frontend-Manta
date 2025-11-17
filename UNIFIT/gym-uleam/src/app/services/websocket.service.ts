import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable, Subject, BehaviorSubject } from 'rxjs';

export interface WebSocketConfig {
  url: string;
  options?: any;
}

export interface DashboardUpdate {
  timestamp: string;
  estadisticas: {
    totalReservas: number;
    reservasActivas: number;
    porcentajeAsistencia: number;
    calificacionPromedio: number;
  };
  usuariosConectados: number;
  salasActivas: { [key: string]: number };
  auto_update?: boolean;
}

export interface Notification {
  type: string;
  message?: string;
  data: any;
  timestamp: string;
  sid: string;
}

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  
  private socket: Socket | null = null;
  private connected$ = new BehaviorSubject<boolean>(false);
  private connectionId$ = new BehaviorSubject<string | null>(null);
  
  // Subjects para eventos específicos
  private dashboardUpdate$ = new Subject<DashboardUpdate>();
  private reservaCreada$ = new Subject<Notification>();
  private reservaActualizada$ = new Subject<Notification>();
  private reservaCancelada$ = new Subject<Notification>();
  private rutinaCreada$ = new Subject<Notification>();
  private rutinaActualizada$ = new Subject<Notification>();
  private usuarioActualizado$ = new Subject<Notification>();
  private notification$ = new Subject<Notification>();
  private connectionStats$ = new Subject<any>();
  private serverStats$ = new Subject<any>();

  constructor() {}

  // ==================== CONEXIÓN ====================

  connect(url: string = 'http://localhost:5000'): void {
    if (this.socket?.connected) {
      console.log('⚠️ Ya existe una conexión WebSocket activa');
      return;
    }

    this.socket = io(url, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    this.setupEventListeners();
    console.log('🔌 Conectando a WebSocket:', url);
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected$.next(false);
      this.connectionId$.next(null);
      console.log('❌ Desconectado del WebSocket');
    }
  }

  isConnected(): Observable<boolean> {
    return this.connected$.asObservable();
  }

  getConnectionId(): Observable<string | null> {
    return this.connectionId$.asObservable();
  }

  // ==================== CONFIGURACIÓN DE LISTENERS ====================

  private setupEventListeners(): void {
    if (!this.socket) return;

    // Eventos de conexión
    this.socket.on('connect', () => {
      console.log('✅ Conectado al WebSocket');
      this.connected$.next(true);
    });

    this.socket.on('disconnect', (reason: string) => {
      console.log('❌ Desconectado del WebSocket:', reason);
      this.connected$.next(false);
      this.connectionId$.next(null);
    });

    this.socket.on('connection_success', (data: any) => {
      console.log('🎉 Conexión exitosa:', data);
      this.connectionId$.next(data.sid);
    });

    this.socket.on('connect_error', (error: any) => {
      console.error('❌ Error de conexión:', error);
    });

    // Eventos de salas
    this.socket.on('room_joined', (data: any) => {
      console.log('🚪 Unido a sala:', data.room);
    });

    this.socket.on('room_left', (data: any) => {
      console.log('🚪 Salió de sala:', data.room);
    });

    // Eventos del dashboard
    this.socket.on('dashboard_update', (data: DashboardUpdate) => {
      this.dashboardUpdate$.next(data);
    });

    this.socket.on('dashboard_notification', (data: Notification) => {
      this.notification$.next(data);
    });

    // Eventos de reservas
    this.socket.on('reserva_creada', (data: Notification) => {
      this.reservaCreada$.next(data);
    });

    this.socket.on('reserva_actualizada', (data: Notification) => {
      this.reservaActualizada$.next(data);
    });

    this.socket.on('reserva_cancelada', (data: Notification) => {
      this.reservaCancelada$.next(data);
    });

    this.socket.on('reserva_confirmada', (data: any) => {
      console.log('✅ Reserva confirmada:', data);
    });

    // Eventos de rutinas
    this.socket.on('rutina_creada', (data: Notification) => {
      this.rutinaCreada$.next(data);
    });

    this.socket.on('rutina_actualizada', (data: Notification) => {
      this.rutinaActualizada$.next(data);
    });

    // Eventos de usuarios
    this.socket.on('usuario_actualizado', (data: Notification) => {
      this.usuarioActualizado$.next(data);
    });

    // Notificaciones generales
    this.socket.on('notification', (data: Notification) => {
      this.notification$.next(data);
    });

    // Estadísticas
    this.socket.on('connection_stats', (data: any) => {
      this.connectionStats$.next(data);
    });

    this.socket.on('server_stats', (data: any) => {
      this.serverStats$.next(data);
    });

    // Errores
    this.socket.on('error', (data: any) => {
      console.error('❌ Error del servidor:', data);
    });
  }

  // ==================== GESTIÓN DE SALAS ====================

  joinRoom(room: string): void {
    if (!this.socket?.connected) {
      console.error('❌ No hay conexión WebSocket activa');
      return;
    }

    this.socket.emit('join_room', { room });
    console.log('📡 Solicitud de unirse a sala:', room);
  }

  leaveRoom(room: string): void {
    if (!this.socket?.connected) {
      console.error('❌ No hay conexión WebSocket activa');
      return;
    }

    this.socket.emit('leave_room', { room });
    console.log('📡 Solicitud de salir de sala:', room);
  }

  // ==================== EVENTOS DEL DASHBOARD ====================

  requestDashboardUpdate(): void {
    if (!this.socket?.connected) {
      console.error('❌ No hay conexión WebSocket activa');
      return;
    }

    this.socket.emit('request_dashboard_update', {});
  }

  broadcastDashboardUpdate(data: any): void {
    if (!this.socket?.connected) {
      console.error('❌ No hay conexión WebSocket activa');
      return;
    }

    this.socket.emit('broadcast_dashboard_update', data);
  }

  onDashboardUpdate(): Observable<DashboardUpdate> {
    return this.dashboardUpdate$.asObservable();
  }

  // ==================== EVENTOS DE RESERVAS ====================

  notifyNuevaReserva(data: any): void {
    if (!this.socket?.connected) {
      console.error('❌ No hay conexión WebSocket activa');
      return;
    }

    this.socket.emit('nueva_reserva', data);
  }

  notifyActualizarReserva(data: any): void {
    if (!this.socket?.connected) {
      console.error('❌ No hay conexión WebSocket activa');
      return;
    }

    this.socket.emit('actualizar_reserva', data);
  }

  notifyCancelarReserva(data: any): void {
    if (!this.socket?.connected) {
      console.error('❌ No hay conexión WebSocket activa');
      return;
    }

    this.socket.emit('cancelar_reserva', data);
  }

  onReservaCreada(): Observable<Notification> {
    return this.reservaCreada$.asObservable();
  }

  onReservaActualizada(): Observable<Notification> {
    return this.reservaActualizada$.asObservable();
  }

  onReservaCancelada(): Observable<Notification> {
    return this.reservaCancelada$.asObservable();
  }

  // ==================== EVENTOS DE RUTINAS ====================

  notifyNuevaRutina(data: any): void {
    if (!this.socket?.connected) {
      console.error('❌ No hay conexión WebSocket activa');
      return;
    }

    this.socket.emit('nueva_rutina', data);
  }

  notifyActualizarRutina(data: any): void {
    if (!this.socket?.connected) {
      console.error('❌ No hay conexión WebSocket activa');
      return;
    }

    this.socket.emit('actualizar_rutina', data);
  }

  onRutinaCreada(): Observable<Notification> {
    return this.rutinaCreada$.asObservable();
  }

  onRutinaActualizada(): Observable<Notification> {
    return this.rutinaActualizada$.asObservable();
  }

  // ==================== EVENTOS DE USUARIOS ====================

  notifyUsuarioActualizado(data: any): void {
    if (!this.socket?.connected) {
      console.error('❌ No hay conexión WebSocket activa');
      return;
    }

    this.socket.emit('usuario_actualizado', data);
  }

  onUsuarioActualizado(): Observable<Notification> {
    return this.usuarioActualizado$.asObservable();
  }

  // ==================== NOTIFICACIONES ====================

  sendNotification(data: any): void {
    if (!this.socket?.connected) {
      console.error('❌ No hay conexión WebSocket activa');
      return;
    }

    this.socket.emit('send_notification', data);
  }

  onNotification(): Observable<Notification> {
    return this.notification$.asObservable();
  }

  // ==================== ESTADÍSTICAS ====================

  requestServerStats(): void {
    if (!this.socket?.connected) {
      console.error('❌ No hay conexión WebSocket activa');
      return;
    }

    this.socket.emit('get_server_stats', {});
  }

  onConnectionStats(): Observable<any> {
    return this.connectionStats$.asObservable();
  }

  onServerStats(): Observable<any> {
    return this.serverStats$.asObservable();
  }
}
