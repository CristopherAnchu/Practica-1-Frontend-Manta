import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';

@Injectable()
export class ExampleService {
  private readonly baseUrl = 'http://localhost:4000/api'; // Reemplaza con tu URL base

  constructor(private readonly httpService: HttpService) {}

  async findAll(): Promise<any> {
    const response: AxiosResponse<any> = await firstValueFrom(
      this.httpService.get(`${this.baseUrl}/examples`)
    );
    return response.data;
  }

  async findOne(id: string): Promise<any> {
    const response: AxiosResponse<any> = await firstValueFrom(
      this.httpService.get(`${this.baseUrl}/examples/${id}`)
    );
    return response.data;
  }
}
