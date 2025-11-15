import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { DivicesService } from './divices.service';
import { Server, Socket } from 'socket.io'

@WebSocketGateway({
  cors: { origin: '*' }
})
export class DivicesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly divicesService: DivicesService) {}

  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
    this.server.emit('connection-status', { 
      clientId: client.id, 
      status: 'connected',
      timestamp: new Date().toISOString()
    });
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
    this.server.emit('connection-status', { 
      clientId: client.id, 
      status: 'disconnected',
      timestamp: new Date().toISOString()
    });
  }

  emitirEvento(event: string, data: any) {
    console.log(`Emitting event: ${event}`, data);
    this.server.emit(event, data);
  }

  @SubscribeMessage('create-user')
  handleCreateUser(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    console.log('User created:', data);
    this.server.emit('user-created', data);
    return { success: true, data };
  }

  @SubscribeMessage('create-reserva')
  handleCreateReserva(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    console.log('Reserva created:', data);
    this.server.emit('reserva-created', data);
    return { success: true, data };
  }

  @SubscribeMessage('create-rutina')
  handleCreateRutina(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    console.log('Rutina created:', data);
    this.server.emit('rutina-created', data);
    return { success: true, data };
  }

  @SubscribeMessage('create-equipo')
  handleCreateEquipo(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    console.log('Equipo created:', data);
    this.server.emit('equipo-created', data);
    return { success: true, data };
  }

  @SubscribeMessage('create-incidencia')
  handleCreateIncidencia(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    console.log('Incidencia created:', data);
    this.server.emit('incidencia-created', data);
    return { success: true, data };
  }

  @SubscribeMessage('create-notification')
  handleCreateNotification(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    console.log('Notification created:', data);
    this.server.emit('notification-created', data);
    return { success: true, data };
  }

  @SubscribeMessage('update-asistencia')
  handleUpdateAsistencia(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    console.log('Asistencia updated:', data);
    this.server.emit('asistencia-updated', data);
    return { success: true, data };
  }

  @SubscribeMessage('evento')
  escucharEvento(@ConnectedSocket() client: Socket, @MessageBody() payload: any) {
    console.log('Evento recibido desde:', client.id);
    console.log('Payload:', payload);
    return { received: true, clientId: client.id };
  }

  @SubscribeMessage('events')
  handleEvent(@MessageBody() data: any, @ConnectedSocket() client: Socket): string {
    console.log('Generic event received:', data);
    return data;
  }
}
