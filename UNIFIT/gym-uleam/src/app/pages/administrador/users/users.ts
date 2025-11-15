import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user.model';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users.html',
  styleUrls: ['./users.css']
})
export class UsersAdmin implements OnInit {
  users: User[] = [];
  private svc = new UserService();

  constructor() {}

  async ngOnInit(): Promise<void> {
    this.users = await this.svc.list();
  }

  async crearUsuario(e: Event) {
    e.preventDefault();
    const nombre = (document.getElementById('u_nombre') as HTMLInputElement).value.trim();
    const email = (document.getElementById('u_email') as HTMLInputElement).value.trim().toLowerCase();
    const password = (document.getElementById('u_password') as HTMLInputElement).value.trim();
    const tipo = ((document.getElementById('u_tipo') as HTMLSelectElement).value || 'CLIENTE') as any;

    if (!email || !password) {
      Swal.fire({ icon: 'warning', text: 'Email y contraseña obligatorios' });
      return;
    }

    const u: User = { id: Date.now().toString(36), nombre, email, password, tipo };
    await this.svc.create(u);
    this.users = await this.svc.list();
    Swal.fire({ icon: 'success', text: 'Usuario creado' });
    (document.getElementById('u_form') as HTMLFormElement).reset();
  }

  async eliminar(id: string) {
    const res = await Swal.fire({ title: 'Confirmar', text: 'Eliminar usuario?', icon: 'warning', showCancelButton: true });
    if (!res.isConfirmed) return;
    await this.svc.delete(id);
    this.users = await this.svc.list();
    Swal.fire({ icon: 'success', text: 'Usuario eliminado' });
  }
}
