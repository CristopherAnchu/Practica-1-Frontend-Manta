import { DataAdapter } from './data-adapter.interface';

export class GenericDataService<T extends { id: string }> {
  constructor(private adapter: DataAdapter<T>) {}

  list(): Promise<T[]> {
    return this.adapter.list();
  }

  get(id: string): Promise<T | undefined> {
    return this.adapter.get(id);
  }

  create(item: T): Promise<T> {
    return this.adapter.create(item);
  }

  update(id: string, item: Partial<T>): Promise<T | undefined> {
    return this.adapter.update(id, item);
  }

  delete(id: string): Promise<boolean> {
    return this.adapter.delete(id);
  }
}
