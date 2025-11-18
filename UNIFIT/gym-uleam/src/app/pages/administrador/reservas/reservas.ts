import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { ReservaService } from '../../../services/reserva.service';
import { UserService } from '../../../services/user.service';
import { Reserva } from '../../../models/reserva.model';
import { User } from '../../../models/user.model';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-admin-reservas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reservas.html',
  styleUrls: ['./reservas.css']
})
export class ReservasAdmin implements OnInit {
  reservas: Reserva[] = [];
  users: User[] = [];
  private svc = inject(ReservaService);
  private userSvc = inject(UserService);

  constructor() {}

  async ngOnInit(): Promise<void> {
    this.reservas = await firstValueFrom(this.svc.list());
    this.users = await firstValueFrom(this.userSvc.list());
    window.addEventListener('reservas.changed', async () => { this.reservas = await firstValueFrom(this.svc.list()); });
  }

  async crear(e: Event) {
    e.preventDefault();
    const usuarioId = (document.getElementById('r_usuario') as HTMLSelectElement).value;
    const fecha = (document.getElementById('r_fecha') as HTMLInputElement).value;
    const hora = (document.getElementById('r_hora') as HTMLInputElement).value;
    const duracion = parseInt((document.getElementById('r_duracion') as HTMLInputElement).value || '1', 10);

    if (!usuarioId || !fecha || !hora) { Swal.fire({ icon: 'warning', text: 'Complete todos los campos' }); return; }

    const nueva: Reserva = { id: Date.now().toString(36), usuarioId, fecha, horarioId: undefined, equipoId: undefined, estado: 'PENDIENTE', createdAt: new Date().toISOString() } as Reserva;
    // store hora in reserva model's fecha/hora fields: our Reserva model uses fecha only; to keep simple, append hora to fecha field
    (nueva as any).hora = hora; (nueva as any).duracion = duracion;
    await this.svc.create(nueva);
    this.reservas = await firstValueFrom(this.svc.list());
    Swal.fire({ icon: 'success', text: 'Reserva creada' });
    (document.getElementById('r_form') as HTMLFormElement).reset();
  }

  async eliminar(id: string) {
    const res = await Swal.fire({ title: 'Confirmar', text: 'Eliminar reserva?', icon: 'warning', showCancelButton: true });
    if (!res.isConfirmed) return;
    await this.svc.delete(id);
    this.reservas = await firstValueFrom(this.svc.list());
    Swal.fire({ icon: 'success', text: 'Reserva eliminada' });
  }

  getUserEmail(usuarioId: string) {
    const u = this.users.find(x => x.id === usuarioId);
    return u ? u.email : 'N/A';
  }
}
