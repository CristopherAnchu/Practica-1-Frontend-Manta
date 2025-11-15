import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { RutinaService } from '../../../services/rutina.service';
import { AuthService } from '../../../services/auth.service';
import { Rutina } from '../../../models/rutina.model';

@Component({
  selector: 'app-rutinas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rutinas.html',
  styleUrls: ['./rutinas.css']
})
export class RutinasPage implements OnInit {
  rutinas: Rutina[] = [];
  private svc = new RutinaService();
  private auth = new AuthService();
  usuarioId: string = '';

  async ngOnInit(): Promise<void> {
    const u = this.auth.getCurrentUser();
    this.usuarioId = (u && ((u as any).id || (u as any).email)) || '';
    this.rutinas = await this.svc.list() as any;
    // filter user's rutinas
    this.rutinas = this.rutinas.filter(r => r.usuarioId === this.usuarioId);
  }

  async crear(e: Event) {
    e.preventDefault();
    const titulo = (document.getElementById('rt_titulo') as HTMLInputElement).value.trim();
    const descripcion = (document.getElementById('rt_descripcion') as HTMLTextAreaElement).value.trim();
    if (!titulo) { Swal.fire({ icon: 'warning', text: 'Titulo obligatorio' }); return; }
    const nueva: Rutina = { id: Date.now().toString(36), usuarioId: this.usuarioId, titulo, descripcion, createdAt: new Date().toISOString() };
    await this.svc.create(nueva);
    this.rutinas = await this.svc.list() as any;
    this.rutinas = this.rutinas.filter(r => r.usuarioId === this.usuarioId);
    Swal.fire({ icon: 'success', text: 'Rutina creada' });
    (document.getElementById('rt_form') as HTMLFormElement).reset();
  }

  async eliminar(id: string) {
    const res = await Swal.fire({ title: 'Confirmar', text: 'Eliminar rutina?', icon: 'warning', showCancelButton: true });
    if (!res.isConfirmed) return;
    await this.svc.delete(id);
    this.rutinas = await this.svc.list() as any;
    this.rutinas = this.rutinas.filter(r => r.usuarioId === this.usuarioId);
    Swal.fire({ icon: 'success', text: 'Rutina eliminada' });
  }
}
