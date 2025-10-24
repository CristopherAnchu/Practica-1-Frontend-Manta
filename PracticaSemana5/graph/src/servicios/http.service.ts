import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { User } from '../users/dto/entities/user.entity';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(private readonly httpService: HttpService) {}

  async findAllClientes(): Promise<User[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<User[]>('http://localhost:3000/api/cliente').pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response?.data ?? error.message);
            throw error;
          }),
        ),
      );
      return response.data;
    } catch (err) {
      throw new Error('Error obteniendo clientes: ' + (err instanceof Error ? err.message : String(err)));
    }
  }
}