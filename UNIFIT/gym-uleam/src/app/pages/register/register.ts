import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {
  private auth = inject(AuthService);
  private router = inject(Router);

  // Modelo de formulario
  formData = {
    nombre: '',
    email: '',
    telefono: '',
    password: '',
    confirmPassword: ''
  };

  // Estados de validación
  showPassword = false;
  showConfirmPassword = false;
  passwordStrength = 0;
  passwordStrengthText = '';
  
  // Flags de validación
  errors = {
    nombre: '',
    email: '',
    telefono: '',
    password: '',
    confirmPassword: ''
  };

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  validateNombre() {
    if (!this.formData.nombre.trim()) {
      this.errors.nombre = 'El nombre es obligatorio';
      return false;
    }
    if (this.formData.nombre.trim().length < 3) {
      this.errors.nombre = 'El nombre debe tener al menos 3 caracteres';
      return false;
    }
    this.errors.nombre = '';
    return true;
  }

  validateEmail() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.formData.email.trim()) {
      this.errors.email = 'El email es obligatorio';
      return false;
    }
    if (!emailRegex.test(this.formData.email)) {
      this.errors.email = 'Ingresa un email válido';
      return false;
    }
    this.errors.email = '';
    return true;
  }

  validateTelefono() {
    if (this.formData.telefono && this.formData.telefono.length > 0) {
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(this.formData.telefono)) {
        this.errors.telefono = 'El teléfono debe tener 10 dígitos';
        return false;
      }
    }
    this.errors.telefono = '';
    return true;
  }

  validatePassword() {
    if (!this.formData.password) {
      this.errors.password = 'La contraseña es obligatoria';
      this.passwordStrength = 0;
      this.passwordStrengthText = '';
      return false;
    }

    if (this.formData.password.length < 6) {
      this.errors.password = 'La contraseña debe tener al menos 6 caracteres';
      this.passwordStrength = 1;
      this.passwordStrengthText = 'Débil';
      return false;
    }

    // Calcular fortaleza
    let strength = 0;
    if (this.formData.password.length >= 8) strength++;
    if (/[a-z]/.test(this.formData.password)) strength++;
    if (/[A-Z]/.test(this.formData.password)) strength++;
    if (/[0-9]/.test(this.formData.password)) strength++;
    if (/[^a-zA-Z0-9]/.test(this.formData.password)) strength++;

    this.passwordStrength = strength;
    
    if (strength <= 2) {
      this.passwordStrengthText = 'Débil';
    } else if (strength === 3) {
      this.passwordStrengthText = 'Media';
    } else {
      this.passwordStrengthText = 'Fuerte';
    }

    this.errors.password = '';
    return true;
  }

  validateConfirmPassword() {
    if (!this.formData.confirmPassword) {
      this.errors.confirmPassword = 'Confirma tu contraseña';
      return false;
    }
    if (this.formData.password !== this.formData.confirmPassword) {
      this.errors.confirmPassword = 'Las contraseñas no coinciden';
      return false;
    }
    this.errors.confirmPassword = '';
    return true;
  }

  async onSubmit(e: Event) {
    e.preventDefault();

    // Validar todos los campos
    const nombreValid = this.validateNombre();
    const emailValid = this.validateEmail();
    const telefonoValid = this.validateTelefono();
    const passwordValid = this.validatePassword();
    const confirmPasswordValid = this.validateConfirmPassword();

    if (!nombreValid || !emailValid || !telefonoValid || !passwordValid || !confirmPasswordValid) {
      Swal.fire({
        icon: 'error',
        title: 'Formulario incompleto',
        text: 'Por favor corrige los errores en el formulario',
        confirmButtonColor: '#667eea'
      });
      return;
    }

    // Verificar si el email ya existe
    const emailCheck = await firstValueFrom(this.auth.checkEmailAvailability(this.formData.email));
    
    if (!emailCheck.available) {
      Swal.fire({
        icon: 'error',
        title: 'Email ya registrado',
        text: 'Este correo electrónico ya está en uso. Intenta con otro o inicia sesión.',
        confirmButtonColor: '#667eea'
      });
      return;
    }

    // Crear usuario (siempre como CLIENTE)
    const user: User = {
      id: '',
      nombre: this.formData.nombre.trim(),
      email: this.formData.email.trim().toLowerCase(),
      telefono: this.formData.telefono || undefined,
      password: this.formData.password,
      tipo: 'CLIENTE' as any,
      rol: 'CLIENTE'
    };

    await this.auth.register(user);
    
    // Mostrar éxito con countdown
    await Swal.fire({
      icon: 'success',
      title: '¡Cuenta creada exitosamente!',
      html: 'Redirigiendo al login en <b>3</b> segundos...',
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false,
      didOpen: () => {
        const b = Swal.getHtmlContainer()?.querySelector('b');
        if (b) {
          let timerInterval = setInterval(() => {
            const timeLeft = Math.ceil((Swal.getTimerLeft() || 0) / 1000);
            b.textContent = timeLeft.toString();
            if (timeLeft <= 0) {
              clearInterval(timerInterval);
            }
          }, 1000);
        }
      }
    });

    await this.router.navigate(['/login']);
  }

  volverAlLogin() {
    this.router.navigate(['/login']);
  }
}
