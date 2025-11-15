import { Injectable } from '@nestjs/common';

@Injectable()
export class DivicesService {
  private connectedClients: Map<string, any> = new Map();

  addClient(clientId: string, clientInfo: any) {
    this.connectedClients.set(clientId, {
      ...clientInfo,
      connectedAt: new Date().toISOString()
    });
  }

  removeClient(clientId: string) {
    return this.connectedClients.delete(clientId);
  }

  getClient(clientId: string) {
    return this.connectedClients.get(clientId);
  }

  getAllClients() {
    return Array.from(this.connectedClients.entries()).map(([id, info]) => ({
      id,
      ...info
    }));
  }

  getClientCount() {
    return this.connectedClients.size;
  }
}
