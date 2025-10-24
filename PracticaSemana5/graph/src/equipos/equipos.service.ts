// src/equipos/equipos-rest.service.ts
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class EquiposRestService {
  constructor(private readonly httpService: HttpService) {}

  async findAll() {
    const response = await firstValueFrom(this.httpService.get('/equipos'));
    return response.data;
  }

  async findOne(id: string) {
    const response = await firstValueFrom(this.httpService.get(`/equipos/${id}`));
    return response.data;
  }
}
