import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, firstValueFrom } from 'rxjs';
import { tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { User } from '../models/user.model';
import { RestApiService } from './rest-api.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(this.loadUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private restApi: RestApiService,
    private http: HttpClient
  ) {}

  /**
   * Carga el usuario del localStorage
   */
  private loadUserFromStorage(): User | null {
    const userData = localStorage.getItem('current_user');
    if (userData) {
      try {
        return JSON.parse(userData);
      } catch {
        return null;
      }
    }
    return null;
  }

  /**
   * Login usando la REST API (Golang)
   */
  async login(email: string, password: string): Promise<User | null> {
    try {
      const response = await firstValueFrom(this.restApi.login(email, password));
      
      if (response.token && response.user) {
        const user: User = {
          ...response.user,
          token: response.token
        };
        
        this.currentUserSubject.next(user);
        
        Swal.fire({
          icon: 'success',
          title: 'Bienvenido',
          text: `Hola ${user.nombre || user.email}`,
          timer: 2000,
          showConfirmButton: false
        });
        
        return user;
      }
      
      Swal.fire({
        icon: 'error',
        title: 'Error de autenticación',
        text: 'Credenciales incorrectas'
      });
      return null;
      
    } catch (error: any) {
      console.error('Error en login:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'No se pudo conectar con el servidor'
      });
      return null;
    }
  }

  /**
   * Logout - cierra sesión
   */
  logout(): void {
    this.restApi.logout();
    this.currentUserSubject.next(null);
    
    Swal.fire({
      icon: 'info',
      title: 'Sesión cerrada',
      text: 'Has salido correctamente',
      timer: 1500,
      showConfirmButton: false
    });
  }

  /**
   * Obtiene el usuario actual
   */
  getCurrentUser(): User | null {
    return this.restApi.getCurrentUser();
  }

  /**
   * Verifica si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    return this.restApi.hasToken();
  }

  /**
   * Obtiene el token actual
   */
  getToken(): string | null {
    return this.restApi.getToken();
  }

  /**
   * Registra un nuevo usuario usando REST API
   */
  async register(user: User): Promise<User | null> {
    try {
      const newUser = await firstValueFrom(this.restApi.createUser({
        nombre: user.nombre,
        email: user.email,
        password: user.password,
        telefono: user.telefono,
        cedula: user.cedula,
        tipo: user.tipo || 'USUARIO_FINAL'
      }));

      Swal.fire({
        icon: 'success',
        title: 'Cuenta creada',
        text: 'Usuario registrado correctamente. Por favor inicia sesión.'
      });

      return newUser;
    } catch (error: any) {
      console.error('Error en registro:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'No se pudo registrar el usuario'
      });
      return null;
    }
  }

  /**
   * Obtiene todos los usuarios (solo administradores)
   */
  getAllUsers(): Observable<User[]> {
    return this.restApi.getUsers();
  }

  /**
   * Verifica si un email está disponible para registro (NO requiere autenticación)
   */
  checkEmailAvailability(email: string): Observable<{available: boolean, message?: string}> {
    return this.restApi.checkEmailAvailability(email);
  }

  /**
   * Verifica si el usuario es administrador
   */
  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.tipo === 'ADMINISTRADOR' || user?.rol?.toLowerCase() === 'administrador';
  }
}
