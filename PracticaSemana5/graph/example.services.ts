import { Injectable, HttpServi**ce } from '@nestjs/common';

@Injectable()
export class ExampleService {
  private readonly baseUrl = 'https://api.example.com'; // Reemplaza con tu URL base

  constructor(private readonly httpService: HttpService) {}

  async findAll(): Promise<any> {
    const response = await this.httpService.get(`${this.baseUrl}/examples`).toPromise();
    return response.data;
  }

  async findOne(id: string): Promise<any> {
    const response = await this.httpService.get(`${this.baseUrl}/examples/${id}`).toPromise();
    return response.data;
  }
}
