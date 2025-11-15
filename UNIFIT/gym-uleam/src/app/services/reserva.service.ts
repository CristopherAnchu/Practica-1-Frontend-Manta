import { GenericDataService } from './generic-data.service';
import { LocalStorageAdapter } from './local-storage-adapter.service';
import { Reserva } from '../models/reserva.model';

export class ReservaService {
  private svc = new GenericDataService<Reserva>(new LocalStorageAdapter<Reserva>('reservas'));

  list() { return this.svc.list(); }
  get(id: string) { return this.svc.get(id); }
  async create(r: Reserva) {
    const created = await this.svc.create(r);
    // dispatch event so UI can react (simple pubsub)
    try { window.dispatchEvent(new CustomEvent('reservas.changed', { detail: created })); } catch (e) {}
    return created;
  }
  async update(id: string, r: Partial<Reserva>) {
    const updated = await this.svc.update(id, r);
    try { window.dispatchEvent(new CustomEvent('reservas.changed', { detail: updated })); } catch (e) {}
    return updated;
  }
  async delete(id: string) {
    const ok = await this.svc.delete(id);
    try { window.dispatchEvent(new CustomEvent('reservas.changed', { detail: { id, deleted: true } })); } catch (e) {}
    return ok;
  }

  async findByUsuario(usuarioId: string) {
    const all = await this.list();
    return all.filter(r => r.usuarioId === usuarioId);
  }
}
