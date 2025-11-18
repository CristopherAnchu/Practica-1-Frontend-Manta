import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RestApiService } from './rest-api.service';
import { GraphqlService } from './graphql.service';
import { User } from '../models/user.model';

/**
 * UserService - Servicio híbrido que usa:
 * - REST API (Golang) para operaciones CRUD
 * - GraphQL (NestJS) para consultas complejas y reportes
 */
@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private restApi: RestApiService,
    private graphql: GraphqlService
  ) {}

  // ==================== OPERACIONES CRUD (REST) ====================

  /**
   * Obtiene todos los usuarios usando REST API
   */
  list(): Observable<User[]> {
    return this.restApi.getUsers();
  }

  /**
   * Obtiene un usuario por ID usando REST API
   */
  get(id: string): Observable<User> {
    return this.restApi.getUserById(parseInt(id));
  }

  /**
   * Crea un nuevo usuario usando REST API
   */
  create(user: User): Observable<User> {
    return this.restApi.createUser(user);
  }

  /**
   * Actualiza un usuario usando REST API
   */
  update(id: string, user: Partial<User>): Observable<User> {
    return this.restApi.updateUser(parseInt(id), user);
  }

  /**
   * Elimina un usuario usando REST API
   */
  delete(id: string): Observable<any> {
    return this.restApi.deleteUser(parseInt(id));
  }

  // ==================== CONSULTAS COMPLEJAS (GraphQL) ====================

  /**
   * Obtiene usuarios activos usando GraphQL
   */
  getUsuariosActivos(limite?: number): Observable<any[]> {
    return this.graphql.getUsuariosActivos(limite);
  }

  /**
   * Obtiene resumen de un usuario usando GraphQL
   */
  getResumenUsuario(usuarioId: number): Observable<any> {
    return this.graphql.getResumenUsuario(usuarioId);
  }

  /**
   * Obtiene usuarios con filtros usando GraphQL
   */
  getUsuariosConFiltros(filter?: any): Observable<any[]> {
    return this.graphql.getUsuarios(filter);
  }
}
