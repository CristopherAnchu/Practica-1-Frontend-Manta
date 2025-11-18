import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface RestResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: any;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class RestApiService {
  
  private apiUrl = environment.apiUrl;
  private tokenKey = 'auth_token';
  private userKey = 'current_user';
  
  // Observable para el estado de autenticación
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {}

  // ==================== AUTENTICACIÓN ====================

  /**
   * Realiza login contra el backend REST (Golang)
   */
  login(email: string, password: string): Observable<LoginResponse> {
    const url = `${this.apiUrl}${environment.endpoints.rest.login}`;
    const body: LoginRequest = { email, password };
    
    return this.http.post<LoginResponse>(url, body).pipe(
      tap(response => {
        if (response.token) {
          this.setToken(response.token);
          if (response.user) {
            this.setUser(response.user);
          }
          this.isAuthenticatedSubject.next(true);
        }
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Cierra sesión
   */
  logout(): void {
    this.removeToken();
    this.removeUser();
    this.isAuthenticatedSubject.next(false);
  }

  /**
   * Obtiene el token almacenado
   */
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  /**
   * Almacena el token JWT
   */
  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  /**
   * Elimina el token
   */
  private removeToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  /**
   * Almacena información del usuario
   */
  private setUser(user: any): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  /**
   * Obtiene información del usuario actual
   */
  getCurrentUser(): any | null {
    const userData = localStorage.getItem(this.userKey);
    return userData ? JSON.parse(userData) : null;
  }

  /**
   * Elimina información del usuario
   */
  private removeUser(): void {
    localStorage.removeItem(this.userKey);
  }

  /**
   * Verifica si hay token almacenado
   */
  hasToken(): boolean {
    return !!this.getToken();
  }

  /**
   * Obtiene headers con autenticación
   */
  private getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  // ==================== USUARIOS ====================

  getUsers(): Observable<any[]> {
    const url = `${this.apiUrl}${environment.endpoints.rest.users}`;
    return this.http.get<any[]>(url, { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  getUserById(id: number): Observable<any> {
    const url = `${this.apiUrl}${environment.endpoints.rest.users}/${id}`;
    return this.http.get<any>(url, { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  createUser(userData: any): Observable<any> {
    const url = `${this.apiUrl}${environment.endpoints.rest.users}`;
    return this.http.post<any>(url, userData, { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  updateUser(id: number, userData: any): Observable<any> {
    const url = `${this.apiUrl}${environment.endpoints.rest.users}/${id}`;
    return this.http.put<any>(url, userData, { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  deleteUser(id: number): Observable<any> {
    const url = `${this.apiUrl}${environment.endpoints.rest.users}/${id}`;
    return this.http.delete<any>(url, { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Verifica si un email está disponible (NO requiere autenticación)
   */
  checkEmailAvailability(email: string): Observable<{available: boolean, message?: string}> {
    const url = `${this.apiUrl}${environment.endpoints.rest.users}/check-email?email=${encodeURIComponent(email)}`;
    return this.http.get<{available: boolean, message?: string}>(url).pipe(
      catchError(this.handleError)
    );
  }

  // ==================== RESERVAS ====================

  getReservas(): Observable<any[]> {
    const url = `${this.apiUrl}${environment.endpoints.rest.reservas}`;
    return this.http.get<any[]>(url, { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  getReservaById(id: string): Observable<any> {
    const url = `${this.apiUrl}${environment.endpoints.rest.reservas}/${id}`;
    return this.http.get<any>(url, { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  createReserva(reservaData: any): Observable<any> {
    const url = `${this.apiUrl}${environment.endpoints.rest.reservas}`;
    return this.http.post<any>(url, reservaData, { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  updateReserva(id: string, reservaData: any): Observable<any> {
    const url = `${this.apiUrl}${environment.endpoints.rest.reservas}/${id}`;
    return this.http.put<any>(url, reservaData, { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  deleteReserva(id: string): Observable<any> {
    const url = `${this.apiUrl}${environment.endpoints.rest.reservas}/${id}`;
    return this.http.delete<any>(url, { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  // ==================== RUTINAS ====================

  getRutinas(): Observable<any[]> {
    const url = `${this.apiUrl}${environment.endpoints.rest.rutinas}`;
    return this.http.get<any[]>(url, { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  getRutinaById(id: string): Observable<any> {
    const url = `${this.apiUrl}${environment.endpoints.rest.rutinas}/${id}`;
    return this.http.get<any>(url, { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  createRutina(rutinaData: any): Observable<any> {
    const url = `${this.apiUrl}${environment.endpoints.rest.rutinas}`;
    return this.http.post<any>(url, rutinaData, { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  updateRutina(id: string, rutinaData: any): Observable<any> {
    const url = `${this.apiUrl}${environment.endpoints.rest.rutinas}/${id}`;
    return this.http.put<any>(url, rutinaData, { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  deleteRutina(id: string): Observable<any> {
    const url = `${this.apiUrl}${environment.endpoints.rest.rutinas}/${id}`;
    return this.http.delete<any>(url, { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  // ==================== EQUIPOS ====================

  getEquipos(): Observable<any[]> {
    const url = `${this.apiUrl}${environment.endpoints.rest.equipos}`;
    return this.http.get<any[]>(url, { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  getEquipoById(id: number): Observable<any> {
    const url = `${this.apiUrl}${environment.endpoints.rest.equipos}/${id}`;
    return this.http.get<any>(url, { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  createEquipo(equipoData: any): Observable<any> {
    const url = `${this.apiUrl}${environment.endpoints.rest.equipos}`;
    return this.http.post<any>(url, equipoData, { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  updateEquipo(id: number, equipoData: any): Observable<any> {
    const url = `${this.apiUrl}${environment.endpoints.rest.equipos}/${id}`;
    return this.http.put<any>(url, equipoData, { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  deleteEquipo(id: number): Observable<any> {
    const url = `${this.apiUrl}${environment.endpoints.rest.equipos}/${id}`;
    return this.http.delete<any>(url, { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  // ==================== INCIDENCIAS ====================

  getIncidencias(): Observable<any[]> {
    const url = `${this.apiUrl}${environment.endpoints.rest.incidencias}`;
    return this.http.get<any[]>(url, { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  getIncidenciaById(id: number): Observable<any> {
    const url = `${this.apiUrl}${environment.endpoints.rest.incidencias}/${id}`;
    return this.http.get<any>(url, { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  createIncidencia(incidenciaData: any): Observable<any> {
    const url = `${this.apiUrl}${environment.endpoints.rest.incidencias}`;
    return this.http.post<any>(url, incidenciaData, { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  updateIncidencia(id: number, incidenciaData: any): Observable<any> {
    const url = `${this.apiUrl}${environment.endpoints.rest.incidencias}/${id}`;
    return this.http.put<any>(url, incidenciaData, { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  deleteIncidencia(id: number): Observable<any> {
    const url = `${this.apiUrl}${environment.endpoints.rest.incidencias}/${id}`;
    return this.http.delete<any>(url, { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  // ==================== ASISTENCIAS ====================

  getAsistencias(): Observable<any[]> {
    const url = `${this.apiUrl}${environment.endpoints.rest.asistencias}`;
    return this.http.get<any[]>(url, { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  getAsistenciaById(id: number): Observable<any> {
    const url = `${this.apiUrl}${environment.endpoints.rest.asistencias}/${id}`;
    return this.http.get<any>(url, { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  createAsistencia(asistenciaData: any): Observable<any> {
    const url = `${this.apiUrl}${environment.endpoints.rest.asistencias}`;
    return this.http.post<any>(url, asistenciaData, { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  updateAsistencia(id: number, asistenciaData: any): Observable<any> {
    const url = `${this.apiUrl}${environment.endpoints.rest.asistencias}/${id}`;
    return this.http.put<any>(url, asistenciaData, { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  deleteAsistencia(id: number): Observable<any> {
    const url = `${this.apiUrl}${environment.endpoints.rest.asistencias}/${id}`;
    return this.http.delete<any>(url, { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  // ==================== MANEJO DE ERRORES ====================

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ha ocurrido un error desconocido';
    
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = error.error?.error || error.error?.message || `Error ${error.status}: ${error.statusText}`;
    }
    
    console.error('Error en REST API:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
