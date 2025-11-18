import { Injectable } from '@angular/core';
import { Observable, firstValueFrom } from 'rxjs';
import { tap } from 'rxjs/operators';
import { RestApiService } from './rest-api.service';
import { GraphqlService } from './graphql.service';
import { WebsocketService } from './websocket.service';
import { Reserva } from '../models/reserva.model';

/**
 * ReservaService - Servicio híbrido que usa:
 * - REST API (Golang) para operaciones CRUD
 * - GraphQL (NestJS) para consultas complejas y estadísticas
 * - WebSocket (Python) para notificaciones en tiempo real
 */
@Injectable({
  providedIn: 'root'
})
export class ReservaService {

  constructor(
    private restApi: RestApiService,
    private graphql: GraphqlService,
    private websocket: WebsocketService
  ) {}

  // ==================== OPERACIONES CRUD (REST) ====================

  /**
   * Obtiene todas las reservas usando REST API
   */
  list(): Observable<Reserva[]> {
    return this.restApi.getReservas();
  }

  /**
   * Obtiene una reserva por ID usando REST API
   */
  get(id: string): Observable<Reserva> {
    return this.restApi.getReservaById(id);
  }

  /**
   * Crea una nueva reserva usando REST API y notifica por WebSocket
   */
  async create(reserva: Reserva): Promise<Reserva> {
    const created = await firstValueFrom(this.restApi.createReserva(reserva));
    
    // Notificar por WebSocket
    this.websocket.emit('nueva_reserva', created);
    
    // Dispatch event para compatibilidad
    try { 
      window.dispatchEvent(new CustomEvent('reservas.changed', { detail: created })); 
    } catch (e) {}
    
    return created;
  }

  /**
   * Actualiza una reserva usando REST API y notifica por WebSocket
   */
  async update(id: string, reserva: Partial<Reserva>): Promise<Reserva> {
    const updated = await firstValueFrom(this.restApi.updateReserva(id, reserva));
    
    // Notificar por WebSocket
    this.websocket.emit('actualizar_reserva', { id, ...updated });
    
    // Dispatch event para compatibilidad
    try { 
      window.dispatchEvent(new CustomEvent('reservas.changed', { detail: updated })); 
    } catch (e) {}
    
    return updated;
  }

  /**
   * Elimina una reserva usando REST API y notifica por WebSocket
   */
  async delete(id: string): Promise<boolean> {
    await firstValueFrom(this.restApi.deleteReserva(id));
    
    // Notificar por WebSocket
    this.websocket.emit('cancelar_reserva', { id });
    
    // Dispatch event para compatibilidad
    try { 
      window.dispatchEvent(new CustomEvent('reservas.changed', { detail: { id, deleted: true } })); 
    } catch (e) {}
    
    return true;
  }

  /**
   * Busca reservas por usuario (usando REST por ahora)
   */
  async findByUsuario(usuarioId: string): Promise<Reserva[]> {
    const all = await firstValueFrom(this.list());
    return all.filter(r => r.usuarioId === usuarioId);
  }

  // ==================== CONSULTAS COMPLEJAS (GraphQL) ====================

  /**
   * Obtiene estadísticas de reservas usando GraphQL
   */
  getEstadisticasReservas(fechaInicio?: string, fechaFin?: string): Observable<any> {
    return this.graphql.getEstadisticasReservas(fechaInicio, fechaFin);
  }

  /**
   * Obtiene reservas con filtros usando GraphQL
   */
  getReservasConFiltros(filter?: any): Observable<any[]> {
    return this.graphql.getReservas(filter);
  }

  /**
   * Obtiene reservas por rango de fechas usando GraphQL
   */
  getReservasPorRango(fechaInicio: string, fechaFin: string): Observable<any[]> {
    return this.graphql.getReservasPorRango(fechaInicio, fechaFin);
  }
}
