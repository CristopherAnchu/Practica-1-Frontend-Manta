import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { UsuarioFinal } from './pages/usuario-final/usuario-final';
import { Administrador } from './pages/administrador/administrador';
import { Register } from './pages/register/register';
import { UsersAdmin } from './pages/administrador/users/users';
import { ReservasAdmin } from './pages/administrador/reservas/reservas';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'crear-cuenta', component: Register },
  { path: 'usuario', component: UsuarioFinal },
  { path: 'admin', component: Administrador },
  { path: 'admin/users', component: UsersAdmin },
  { path: 'admin/reservas', component: ReservasAdmin },
];