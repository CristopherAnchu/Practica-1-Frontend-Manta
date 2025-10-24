// src/capacidades/capacidades-rest.service.ts
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CapacidadesRestService {
  constructor(private readonly httpService: HttpService) {}

  async findAll() {
    const response = await firstValueFrom(this.httpService.get('/capacidades'));
    return response.data;
  }

  async findOne(id: string) {
    const response = await firstValueFrom(this.httpService.get(`/capacidades/${id}`));
    return response.data;
  }
}
