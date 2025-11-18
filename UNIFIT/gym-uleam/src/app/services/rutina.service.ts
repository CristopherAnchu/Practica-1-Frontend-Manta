import { Injectable } from '@angular/core';
import { Observable, firstValueFrom } from 'rxjs';
import { RestApiService } from './rest-api.service';
import { GraphqlService } from './graphql.service';
import { WebsocketService } from './websocket.service';
import { Rutina } from '../models/rutina.model';

/**
 * RutinaService - Servicio híbrido que usa:
 * - REST API (Golang) para operaciones CRUD
 * - GraphQL (NestJS) para consultas complejas y reportes
 * - WebSocket (Python) para notificaciones en tiempo real
 */
@Injectable({
  providedIn: 'root'
})
export class RutinaService {

  constructor(
    private restApi: RestApiService,
    private graphql: GraphqlService,
    private websocket: WebsocketService
  ) {}

  // ==================== OPERACIONES CRUD (REST) ====================

  /**
   * Obtiene todas las rutinas usando REST API
   */
  list(): Observable<Rutina[]> {
    return this.restApi.getRutinas();
  }

  /**
   * Obtiene una rutina por ID usando REST API
   */
  get(id: string): Observable<Rutina> {
    return this.restApi.getRutinaById(id);
  }

  /**
   * Crea una nueva rutina usando REST API y notifica por WebSocket
   */
  async create(rutina: Rutina): Promise<Rutina> {
    const created = await firstValueFrom(this.restApi.createRutina(rutina));
    
    // Notificar por WebSocket
    this.websocket.emit('nueva_rutina', created);
    
    return created;
  }

  /**
   * Actualiza una rutina usando REST API y notifica por WebSocket
   */
  async update(id: string, rutina: Partial<Rutina>): Promise<Rutina> {
    const updated = await firstValueFrom(this.restApi.updateRutina(id, rutina));
    
    // Notificar por WebSocket
    this.websocket.emit('actualizar_rutina', { id, ...updated });
    
    return updated;
  }

  /**
   * Elimina una rutina usando REST API y notifica por WebSocket
   */
  async delete(id: string): Promise<boolean> {
    await firstValueFrom(this.restApi.deleteRutina(id));
    
    // Notificar por WebSocket
    this.websocket.emit('cancelar_rutina', { id });
    
    return true;
  }

  // ==================== CONSULTAS COMPLEJAS (GraphQL) ====================

  /**
   * Obtiene rutinas con filtros usando GraphQL
   */
  getRutinasConFiltros(filter?: any): Observable<any[]> {
    return this.graphql.getRutinas(filter);
  }

  /**
   * Obtiene rutinas populares usando GraphQL
   */
  getRutinasPopulares(limite?: number): Observable<any[]> {
    return this.graphql.getRutinasPopulares(limite);
  }

  /**
   * Obtiene reporte de ocupación usando GraphQL
   */
  getReporteOcupacion(fecha?: string): Observable<any[]> {
    return this.graphql.getReporteOcupacion(fecha);
  }
}
