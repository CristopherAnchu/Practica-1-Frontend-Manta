import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Obtener el token del localStorage
    const token = localStorage.getItem('auth_token');

    // Si existe token y la petición no es de login, agregar el header Authorization
    if (token && !request.url.includes('/login')) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    // Manejar la petición y capturar errores
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Error 401 - No autorizado
        if (error.status === 401) {
          // Limpiar sesión y redirigir al login
          localStorage.removeItem('auth_token');
          localStorage.removeItem('current_user');
          
          Swal.fire({
            icon: 'warning',
            title: 'Sesión expirada',
            text: 'Tu sesión ha expirado. Por favor inicia sesión nuevamente.',
            confirmButtonText: 'Ir a Login'
          }).then(() => {
            this.router.navigate(['/login']);
          });
        }

        // Error 403 - Prohibido
        if (error.status === 403) {
          Swal.fire({
            icon: 'error',
            title: 'Acceso denegado',
            text: 'No tienes permisos para realizar esta acción.'
          });
        }

        // Error 500 - Error del servidor
        if (error.status === 500) {
          Swal.fire({
            icon: 'error',
            title: 'Error del servidor',
            text: 'Ha ocurrido un error en el servidor. Por favor intenta más tarde.'
          });
        }

        return throwError(() => error);
      })
    );
  }
}
