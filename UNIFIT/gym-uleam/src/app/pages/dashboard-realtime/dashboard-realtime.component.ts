import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebsocketService, DashboardUpdate, Notification } from '../../services/websocket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard-realtime',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-realtime.component.html',
  styleUrls: ['./dashboard-realtime.component.css']
})
export class DashboardRealtimeComponent implements OnInit, OnDestroy {
  
  // Estado de conexión
  isConnected = false;
  connectionId: string | null = null;
  
  // Datos del dashboard
  dashboardData: DashboardUpdate | null = null;
  lastUpdate: Date | null = null;
  
  // Notificaciones
  notifications: Notification[] = [];
  maxNotifications = 10;
  
  // Estadísticas del servidor
  serverStats: {
    totalConnections: number;
    rooms: { [key: string]: { members: number } };
    timestamp: string;
  } | null = null;
  
  // Subscripciones
  private subscriptions: Subscription[] = [];

  constructor(private wsService: WebsocketService) {}

  ngOnInit(): void {
    // Conectar al WebSocket
    this.wsService.connect('http://localhost:5000');
    
    // Suscribirse al estado de conexión
    this.subscriptions.push(
      this.wsService.isConnected().subscribe(connected => {
        this.isConnected = connected;
        
        if (connected) {
          // Unirse a la sala del dashboard
          this.wsService.joinRoom('dashboard');
          
          // Solicitar actualización inicial
          setTimeout(() => {
            this.wsService.requestDashboardUpdate();
          }, 500);
        }
      })
    );
    
    // Suscribirse al ID de conexión
    this.subscriptions.push(
      this.wsService.getConnectionId().subscribe(id => {
        this.connectionId = id;
      })
    );
    
    // Suscribirse a actualizaciones del dashboard
    this.subscriptions.push(
      this.wsService.onDashboardUpdate().subscribe(data => {
        this.dashboardData = data;
        this.lastUpdate = new Date();
        
        if (data.auto_update) {
          console.log('📊 Dashboard auto-actualizado');
        }
      })
    );
    
    // Suscribirse a notificaciones
    this.subscriptions.push(
      this.wsService.onNotification().subscribe(notification => {
        this.addNotification(notification);
      })
    );
    
    // Suscribirse a eventos de reservas
    this.subscriptions.push(
      this.wsService.onReservaCreada().subscribe(notification => {
        this.addNotification(notification);
      })
    );
    
    this.subscriptions.push(
      this.wsService.onReservaActualizada().subscribe(notification => {
        this.addNotification(notification);
      })
    );
    
    this.subscriptions.push(
      this.wsService.onReservaCancelada().subscribe(notification => {
        this.addNotification(notification);
      })
    );
    
    // Suscribirse a eventos de rutinas
    this.subscriptions.push(
      this.wsService.onRutinaCreada().subscribe(notification => {
        this.addNotification(notification);
      })
    );
    
    this.subscriptions.push(
      this.wsService.onRutinaActualizada().subscribe(notification => {
        this.addNotification(notification);
      })
    );
    
    // Suscribirse a estadísticas del servidor
    this.subscriptions.push(
      this.wsService.onServerStats().subscribe(stats => {
        this.serverStats = stats;
      })
    );
  }

  ngOnDestroy(): void {
    // Salir de la sala del dashboard
    if (this.isConnected) {
      this.wsService.leaveRoom('dashboard');
    }
    
    // Limpiar subscripciones
    this.subscriptions.forEach(sub => sub.unsubscribe());
    
    // Desconectar
    this.wsService.disconnect();
  }

  // ==================== ACCIONES ====================

  refreshDashboard(): void {
    this.wsService.requestDashboardUpdate();
  }

  getServerStats(): void {
    this.wsService.requestServerStats();
  }

  sendTestNotification(): void {
    this.wsService.sendNotification({
      room: 'dashboard',
      type: 'info',
      message: 'Notificación de prueba desde Angular',
      data: { test: true }
    });
  }

  // ==================== NOTIFICACIONES ====================

  addNotification(notification: Notification): void {
    this.notifications.unshift(notification);
    
    // Limitar el número de notificaciones
    if (this.notifications.length > this.maxNotifications) {
      this.notifications.pop();
    }
  }

  clearNotifications(): void {
    this.notifications = [];
  }

  getNotificationIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'nueva_reserva': 'bi-calendar-plus',
      'reserva_actualizada': 'bi-calendar-check',
      'reserva_cancelada': 'bi-calendar-x',
      'nueva_rutina': 'bi-plus-circle',
      'rutina_actualizada': 'bi-pencil',
      'usuario_actualizado': 'bi-person-check',
      'info': 'bi-info-circle',
      'success': 'bi-check-circle',
      'warning': 'bi-exclamation-triangle',
      'error': 'bi-x-circle'
    };
    
    return icons[type] || 'bi-bell';
  }

  getNotificationClass(type: string): string {
    const classes: { [key: string]: string } = {
      'nueva_reserva': 'notification-success',
      'reserva_actualizada': 'notification-info',
      'reserva_cancelada': 'notification-warning',
      'nueva_rutina': 'notification-success',
      'rutina_actualizada': 'notification-info',
      'info': 'notification-info',
      'success': 'notification-success',
      'warning': 'notification-warning',
      'error': 'notification-error'
    };
    
    return classes[type] || 'notification-info';
  }

  formatTimestamp(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  }
}
