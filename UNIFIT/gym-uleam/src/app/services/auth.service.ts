import Swal from 'sweetalert2';
import { User } from '../models/user.model';
import { LocalStorageAdapter } from './local-storage-adapter.service';

export class AuthService {
  private adapter = new LocalStorageAdapter<User>('usuarios');
  private sessionKey = 'usuarioActivo';

  async getAllUsers(): Promise<User[]> {
    const local = await this.adapter.list();
    // try to fetch default users from public usuarios.json (silent)
    try {
      const resp = await fetch('/usuarios.json');
      if (resp.ok) {
        const data = await resp.json();
        return data.concat(local);
      }
    } catch (e) {
      // ignore
    }
    return local;
  }

  async login(email: string, password: string): Promise<User | null> {
    const users = await this.getAllUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!user) {
      return null;
    }
    // save session (simulated token)
    const session = { ...user, token: 'local-' + btoa(user.email + ':' + new Date().toISOString()) } as any;
    localStorage.setItem(this.sessionKey, JSON.stringify(session));
    return session as unknown as User;
  }

  logout() {
    localStorage.removeItem(this.sessionKey);
  }

  getCurrentUser(): User | null {
    try {
      return JSON.parse(localStorage.getItem(this.sessionKey) || 'null');
    } catch (e) {
      return null;
    }
  }

  isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  }

  async register(user: User): Promise<User> {
    // attach id and createdAt
    const u: User = { ...user, id: (Math.random() + Date.now()).toString(36), createdAt: new Date().toISOString() };
    await this.adapter.create(u);
    Swal.fire({ icon: 'success', title: 'Cuenta creada', text: 'Usuario registrado correctamente' });
    return u;
  }
}
