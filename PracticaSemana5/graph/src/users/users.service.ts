import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';

@Injectable()
export class UsersRestService {
  private readonly baseUrl = 'http://localhost:4000/api/users';

  constructor(private readonly httpService: HttpService) {}

  async findAll(): Promise<any> {
    const response: AxiosResponse<any> = await firstValueFrom(
      this.httpService.get(`${this.baseUrl}`)
    );
    return response.data;
  }

  // Agrega este método
  async findOne(id: string): Promise<any> {
    const response: AxiosResponse<any> = await firstValueFrom(
      this.httpService.get(`${this.baseUrl}/${id}`)
    );
    return response.data;
  }
}




