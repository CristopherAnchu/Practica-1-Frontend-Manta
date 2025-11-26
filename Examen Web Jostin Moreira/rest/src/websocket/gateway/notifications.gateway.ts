import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*', // Permitir cualquier origen en desarrollo
    credentials: true,
  },
  pingTimeout: 60000, // 60 segundos
  pingInterval: 25000, // 25 segundos
  transports: ['websocket', 'polling'], // Soportar ambos transportes
})
export class NotificationsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('NotificationsGateway');
  private connectedClients = 0;

  afterInit(server: Server) {
    this.logger.log('🔌 WebSocket Gateway inicializado');
    this.logger.log(`📡 Socket.io escuchando en puerto del servidor NestJS`);
  }

  handleConnection(client: Socket) {
    this.connectedClients++;
    this.logger.log(`✅ Cliente conectado: ${client.id} (Total: ${this.connectedClients})`);

    // Enviar mensaje de bienvenida
    client.emit('connection', {
      message: 'Conectado al servidor WebSocket',
      clientId: client.id,
      timestamp: new Date().toISOString(),
    });
  }

  handleDisconnect(client: Socket) {
    this.connectedClients--;
    this.logger.log(`❌ Cliente desconectado: ${client.id} (Total: ${this.connectedClients})`);
  }

  // Método para enviar notificaciones globales (sin rooms)
  sendNotification(notification: {
    id: string;
    entity: string;
    operation: string;
    data: any;
    timestamp: string;
  }) {
    this.logger.log(`📢 Emitiendo notificación: ${notification.entity} - ${notification.operation}`);
    
    // Emitir a todos los clientes conectados (global, sin rooms)
    this.server.emit('notification', notification);

    return {
      success: true,
      clientsNotified: this.connectedClients,
    };
  }

  // Obtener estadísticas
  getStats() {
    return {
      connectedClients: this.connectedClients,
      timestamp: new Date().toISOString(),
    };
  }
}
