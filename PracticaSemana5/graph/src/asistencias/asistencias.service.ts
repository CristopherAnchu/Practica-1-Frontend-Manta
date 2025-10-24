import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';

@Injectable()
export class AsistenciasRestService {
  private readonly baseUrl = 'hhttp://localhost:4000/api/asistencias';

  constructor(private readonly httpService: HttpService) {}

  async findAll(): Promise<any> {
    const response: AxiosResponse<any> = await firstValueFrom(
      this.httpService.get(`${this.baseUrl}`)
    );
    return response.data;
  }

  async findOne(id: string): Promise<any> {
    const response: AxiosResponse<any> = await firstValueFrom(
      this.httpService.get(`${this.baseUrl}/${id}`)
    );
    return response.data;
  }
}
