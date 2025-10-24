import { Injectable, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { UserType } from '../types/user.type';

@Injectable()
export class UsersService {
  constructor(private readonly httpService: HttpService) {}

  async findAll(): Promise<UserType[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get('/users')
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Error al obtener usuarios',
        error.response?.status || 500,
      );
    }
  }

  async findOne(id: string): Promise<UserType> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`/users/${id}`)
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Error al obtener el usuario',
        error.response?.status || 500,
      );
    }
  }
}