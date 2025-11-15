import { GenericDataService } from './generic-data.service';
import { LocalStorageAdapter } from './local-storage-adapter.service';
import { User } from '../models/user.model';

export class UserService {
  private svc = new GenericDataService<User>(new LocalStorageAdapter<User>('usuarios'));

  list() { return this.svc.list(); }
  get(id: string) { return this.svc.get(id); }
  create(u: User) { return this.svc.create(u); }
  update(id: string, u: Partial<User>) { return this.svc.update(id, u); }
  delete(id: string) { return this.svc.delete(id); }
}
