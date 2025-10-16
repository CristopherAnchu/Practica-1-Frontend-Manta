import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  async create(createUserDto: CreateUserDto) {
    const usuario = this.userRepository.create(createUserDto);
    return await this.userRepository.save(usuario);
  }

  constructor(
    @InjectRepository(User) 
    private readonly userRepository: Repository<User>,
  ) {}

   async findAll() {
    return `This action returns all users`;
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOneBy({id})
    if (!user)
      throw new Error(`Usuario con el id ${id} no encontrado`);
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOneBy({id})
    if (!user)
      throw new Error(`Usuario con el id ${id} no encontrado`);
    await this.userRepository.update(id, updateUserDto);
    return this.userRepository.findOneBy({id});
  }

  async remove(id: string) {
    const user = this.findOne(id);
    await this.userRepository.delete(id);
    return `This action removes a #${id} user`;
  }
}


