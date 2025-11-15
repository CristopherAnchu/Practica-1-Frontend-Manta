import { DataAdapter } from './data-adapter.interface';

export class LocalStorageAdapter<T extends { id: string }> implements DataAdapter<T> {
  constructor(private storageKey: string) {}

  private readAll(): T[] {
    try {
      return JSON.parse(localStorage.getItem(this.storageKey) || '[]') as T[];
    } catch (e) {
      console.error('LocalStorage read error', e);
      return [];
    }
  }

  private writeAll(items: T[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(items));
  }

  async list(): Promise<T[]> {
    return this.readAll();
  }

  async get(id: string): Promise<T | undefined> {
    return this.readAll().find(i => i.id === id);
  }

  async create(item: T): Promise<T> {
    const items = this.readAll();
    items.push(item);
    this.writeAll(items);
    return item;
  }

  async update(id: string, item: Partial<T>): Promise<T | undefined> {
    const items = this.readAll();
    const idx = items.findIndex(i => i.id === id);
    if (idx === -1) return undefined;
    items[idx] = { ...items[idx], ...item } as T;
    this.writeAll(items);
    return items[idx];
  }

  async delete(id: string): Promise<boolean> {
    const items = this.readAll();
    const filtered = items.filter(i => i.id !== id);
    this.writeAll(filtered);
    return filtered.length !== items.length;
  }
}
