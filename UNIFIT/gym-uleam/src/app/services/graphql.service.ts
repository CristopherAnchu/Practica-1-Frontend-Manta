import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable, map } from 'rxjs';
import * as QUERIES from '../graphql/graphql.queries';
import * as TYPES from '../graphql/graphql.types';

@Injectable({
  providedIn: 'root'
})
export class GraphqlService {

  constructor(private apollo: Apollo) {}

  // ==================== USUARIOS ====================

  getUsuarios(filter?: TYPES.UsuarioFilterInput): Observable<TYPES.Usuario[]> {
    return this.apollo.query<{ usuarios: TYPES.Usuario[] }>({
      query: QUERIES.GET_USUARIOS,
      variables: { filter }
    }).pipe(
      map(result => result.data!.usuarios)
    );
  }

  getUsuario(id: number): Observable<TYPES.Usuario> {
    return this.apollo.query<{ usuario: TYPES.Usuario }>({
      query: QUERIES.GET_USUARIO,
      variables: { id }
    }).pipe(
      map(result => result.data!.usuario)
    );
  }

  getResumenUsuario(usuarioId: number): Observable<TYPES.ResumenUsuario> {
    return this.apollo.query<{ resumenUsuario: TYPES.ResumenUsuario }>({
      query: QUERIES.GET_RESUMEN_USUARIO,
      variables: { usuarioId }
    }).pipe(
      map(result => result.data!.resumenUsuario)
    );
  }

  getUsuariosActivos(limite?: number): Observable<TYPES.UsuarioActivo[]> {
    return this.apollo.query<{ usuariosActivos: TYPES.UsuarioActivo[] }>({
      query: QUERIES.GET_USUARIOS_ACTIVOS,
      variables: { limite }
    }).pipe(
      map(result => result.data!.usuariosActivos)
    );
  }

  crearUsuario(input: TYPES.CreateUsuarioInput): Observable<TYPES.Usuario> {
    return this.apollo.mutate<{ crearUsuario: TYPES.Usuario }>({
      mutation: QUERIES.CREAR_USUARIO,
      variables: { input }
    }).pipe(
      map(result => result.data!.crearUsuario)
    );
  }

  actualizarUsuario(id: number, input: TYPES.UpdateUsuarioInput): Observable<TYPES.Usuario> {
    return this.apollo.mutate<{ actualizarUsuario: TYPES.Usuario }>({
      mutation: QUERIES.ACTUALIZAR_USUARIO,
      variables: { id, input }
    }).pipe(
      map(result => result.data!.actualizarUsuario)
    );
  }

  eliminarUsuario(id: number): Observable<boolean> {
    return this.apollo.mutate<{ eliminarUsuario: boolean }>({
      mutation: QUERIES.ELIMINAR_USUARIO,
      variables: { id }
    }).pipe(
      map(result => result.data!.eliminarUsuario)
    );
  }

  // ==================== RUTINAS ====================

  getRutinas(filter?: TYPES.RutinaFilterInput): Observable<TYPES.Rutina[]> {
    return this.apollo.query<{ rutinas: TYPES.Rutina[] }>({
      query: QUERIES.GET_RUTINAS,
      variables: { filter }
    }).pipe(
      map(result => result.data!.rutinas)
    );
  }

  getRutina(id: number): Observable<TYPES.Rutina> {
    return this.apollo.query<{ rutina: TYPES.Rutina }>({
      query: QUERIES.GET_RUTINA,
      variables: { id }
    }).pipe(
      map(result => result.data!.rutina)
    );
  }

  getRutinasPopulares(limite?: number): Observable<TYPES.RutinaPopular[]> {
    return this.apollo.query<{ rutinasPopulares: TYPES.RutinaPopular[] }>({
      query: QUERIES.GET_RUTINAS_POPULARES,
      variables: { limite }
    }).pipe(
      map(result => result.data!.rutinasPopulares)
    );
  }

  crearRutina(input: TYPES.CreateRutinaInput): Observable<TYPES.Rutina> {
    return this.apollo.mutate<{ crearRutina: TYPES.Rutina }>({
      mutation: QUERIES.CREAR_RUTINA,
      variables: { input }
    }).pipe(
      map(result => result.data!.crearRutina)
    );
  }

  actualizarRutina(id: number, input: TYPES.UpdateRutinaInput): Observable<TYPES.Rutina> {
    return this.apollo.mutate<{ actualizarRutina: TYPES.Rutina }>({
      mutation: QUERIES.ACTUALIZAR_RUTINA,
      variables: { id, input }
    }).pipe(
      map(result => result.data!.actualizarRutina)
    );
  }

  eliminarRutina(id: number): Observable<boolean> {
    return this.apollo.mutate<{ eliminarRutina: boolean }>({
      mutation: QUERIES.ELIMINAR_RUTINA,
      variables: { id }
    }).pipe(
      map(result => result.data!.eliminarRutina)
    );
  }

  // ==================== RESERVAS ====================

  getReservas(filter?: TYPES.ReservaFilterInput): Observable<TYPES.Reserva[]> {
    return this.apollo.query<{ reservas: TYPES.Reserva[] }>({
      query: QUERIES.GET_RESERVAS,
      variables: { filter }
    }).pipe(
      map(result => result.data!.reservas)
    );
  }

  getReserva(id: number): Observable<TYPES.Reserva> {
    return this.apollo.query<{ reserva: TYPES.Reserva }>({
      query: QUERIES.GET_RESERVA,
      variables: { id }
    }).pipe(
      map(result => result.data!.reserva)
    );
  }

  crearReserva(input: TYPES.CreateReservaInput): Observable<TYPES.Reserva> {
    return this.apollo.mutate<{ crearReserva: TYPES.Reserva }>({
      mutation: QUERIES.CREAR_RESERVA,
      variables: { input }
    }).pipe(
      map(result => result.data!.crearReserva)
    );
  }

  actualizarReserva(id: number, input: TYPES.UpdateReservaInput): Observable<TYPES.Reserva> {
    return this.apollo.mutate<{ actualizarReserva: TYPES.Reserva }>({
      mutation: QUERIES.ACTUALIZAR_RESERVA,
      variables: { id, input }
    }).pipe(
      map(result => result.data!.actualizarReserva)
    );
  }

  eliminarReserva(id: number): Observable<boolean> {
    return this.apollo.mutate<{ eliminarReserva: boolean }>({
      mutation: QUERIES.ELIMINAR_RESERVA,
      variables: { id }
    }).pipe(
      map(result => result.data!.eliminarReserva)
    );
  }

  getReservasPorRango(fechaInicio: string, fechaFin: string): Observable<TYPES.Reserva[]> {
    return this.apollo.query<{ reservas: TYPES.Reserva[] }>({
      query: QUERIES.GET_RESERVAS,
      variables: {
        filter: {
          fechaInicio,
          fechaFin
        }
      }
    }).pipe(
      map(result => result.data!.reservas)
    );
  }

  // ==================== REPORTES ====================

  getEstadisticasReservas(fechaInicio?: string, fechaFin?: string): Observable<TYPES.EstadisticasReservas> {
    return this.apollo.query<{ estadisticasReservas: TYPES.EstadisticasReservas }>({
      query: QUERIES.GET_ESTADISTICAS_RESERVAS,
      variables: { fechaInicio, fechaFin }
    }).pipe(
      map(result => result.data!.estadisticasReservas)
    );
  }

  getTendenciasReservas(fechaInicio: string, fechaFin: string): Observable<TYPES.TendenciaReservas[]> {
    return this.apollo.query<{ tendenciasReservas: TYPES.TendenciaReservas[] }>({
      query: QUERIES.GET_TENDENCIAS_RESERVAS,
      variables: { fechaInicio, fechaFin }
    }).pipe(
      map(result => result.data!.tendenciasReservas)
    );
  }

  getReporteOcupacion(fecha?: string): Observable<TYPES.ReporteOcupacion[]> {
    return this.apollo.query<{ reporteOcupacion: TYPES.ReporteOcupacion[] }>({
      query: QUERIES.GET_REPORTE_OCUPACION,
      variables: { fecha }
    }).pipe(
      map(result => result.data!.reporteOcupacion)
    );
  }

  getDashboardCompleto(): Observable<TYPES.DashboardData> {
    return this.apollo.query<TYPES.DashboardData>({
      query: QUERIES.GET_DASHBOARD_COMPLETO
    }).pipe(
      map(result => result.data!)
    );
  }

  // ==================== ROLES ====================

  getRoles(): Observable<TYPES.Rol[]> {
    return this.apollo.query<{ roles: TYPES.Rol[] }>({
      query: QUERIES.GET_ROLES
    }).pipe(
      map(result => result.data!.roles)
    );
  }

  getRol(id: number): Observable<TYPES.Rol> {
    return this.apollo.query<{ rol: TYPES.Rol }>({
      query: QUERIES.GET_ROL,
      variables: { id }
    }).pipe(
      map(result => result.data!.rol)
    );
  }

  crearRol(input: TYPES.CreateRolInput): Observable<TYPES.Rol> {
    return this.apollo.mutate<{ crearRol: TYPES.Rol }>({
      mutation: QUERIES.CREAR_ROL,
      variables: { input }
    }).pipe(
      map(result => result.data!.crearRol)
    );
  }

  actualizarRol(id: number, input: TYPES.UpdateRolInput): Observable<TYPES.Rol> {
    return this.apollo.mutate<{ actualizarRol: TYPES.Rol }>({
      mutation: QUERIES.ACTUALIZAR_ROL,
      variables: { id, input }
    }).pipe(
      map(result => result.data!.actualizarRol)
    );
  }

  eliminarRol(id: number): Observable<boolean> {
    return this.apollo.mutate<{ eliminarRol: boolean }>({
      mutation: QUERIES.ELIMINAR_ROL,
      variables: { id }
    }).pipe(
      map(result => result.data!.eliminarRol)
    );
  }
}
