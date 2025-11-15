import { GenericDataService } from './generic-data.service';
import { LocalStorageAdapter } from './local-storage-adapter.service';
import { Rutina } from '../models/rutina.model';

export class RutinaService {
  private svc = new GenericDataService<Rutina>(new LocalStorageAdapter<Rutina>('rutinas'));

  list() { return this.svc.list(); }
  get(id: string) { return this.svc.get(id); }
  create(r: Rutina) { return this.svc.create(r); }
  update(id: string, r: Partial<Rutina>) { return this.svc.update(id, r); }
  delete(id: string) { return this.svc.delete(id); }
}
