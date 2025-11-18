import { Component, inject } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  private auth = inject(AuthService);
  private router = inject(Router);

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    const emailInput = (document.getElementById('formEmail') as HTMLInputElement).value.trim().toLowerCase();
    const passwordInput = (document.getElementById('formPassword') as HTMLInputElement).value.trim();

    if (!emailInput || !passwordInput) {
      Swal.fire({ icon: 'warning', title: 'Ops', text: 'Ingrese correo y contraseña' });
      return;
    }

    console.log('Intentando login con:', emailInput);
    const user = await this.auth.login(emailInput, passwordInput);
    console.log('Usuario obtenido:', user);
    
    if (!user) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Correo o contraseña incorrectos' });
      return;
    }

    // redirect según tipo
    const tipo = (user as any).tipo?.toString()?.toUpperCase?.() || '';
    console.log('Tipo de usuario:', tipo);
    
    if (tipo === 'CLIENTE') {
      console.log('Navegando a /usuario');
      await this.router.navigate(['/usuario']);
    } else if (tipo === 'ADMINISTRADOR') {
      console.log('Navegando a /admin');
      await this.router.navigate(['/admin']);
    } else {
      console.log('Navegando a /usuario (default)');
      await this.router.navigate(['/usuario']);
    }
  }

  irCrearUsuario() {
    this.router.navigate(['/crear-cuenta']);
  }
}
