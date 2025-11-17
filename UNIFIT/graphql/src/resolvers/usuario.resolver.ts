import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UsuarioService } from '../services/usuario.service';
import { Usuario } from '../entities/usuario.entity';
import { CreateUsuarioInput, UpdateUsuarioInput, UsuarioFilterInput } from '../dto/usuario.input';
import { UsuarioActivo, ResumenUsuario } from '../dto/reportes.types';

@Resolver(() => Usuario)
export class UsuarioResolver {
  constructor(private readonly usuarioService: UsuarioService) {}

  // Queries

  @Query(() => [Usuario], { 
    name: 'usuarios',
    description: 'Obtiene todos los usuarios con filtros opcionales' 
  })
  async getUsuarios(
    @Args('filter', { type: () => UsuarioFilterInput, nullable: true }) 
    filter?: UsuarioFilterInput,
  ): Promise<Usuario[]> {
    return this.usuarioService.findAll(filter);
  }

  @Query(() => Usuario, { 
    name: 'usuario',
    description: 'Obtiene un usuario por su ID' 
  })
  async getUsuario(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Usuario> {
    return this.usuarioService.findOne(id);
  }

  @Query(() => [UsuarioActivo], {
    name: 'usuariosActivos',
    description: 'Obtiene estadísticas de usuarios más activos'
  })
  async getUsuariosActivos(
    @Args('limite', { type: () => Int, nullable: true }) limite?: number,
  ): Promise<UsuarioActivo[]> {
    return this.usuarioService.getUsuariosActivos(limite);
  }

  @Query(() => ResumenUsuario, {
    name: 'resumenUsuario',
    description: 'Obtiene resumen completo de actividad de un usuario'
  })
  async getResumenUsuario(
    @Args('usuarioId', { type: () => Int }) usuarioId: number,
  ): Promise<ResumenUsuario> {
    return this.usuarioService.getResumenUsuario(usuarioId);
  }

  // Mutations

  @Mutation(() => Usuario, {
    name: 'crearUsuario',
    description: 'Crea un nuevo usuario'
  })
  async crearUsuario(
    @Args('input') createUsuarioInput: CreateUsuarioInput,
  ): Promise<Usuario> {
    return this.usuarioService.create(createUsuarioInput);
  }

  @Mutation(() => Usuario, {
    name: 'actualizarUsuario',
    description: 'Actualiza un usuario existente'
  })
  async actualizarUsuario(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') updateUsuarioInput: UpdateUsuarioInput,
  ): Promise<Usuario> {
    return this.usuarioService.update(id, updateUsuarioInput);
  }

  @Mutation(() => Boolean, {
    name: 'eliminarUsuario',
    description: 'Elimina un usuario por su ID'
  })
  async eliminarUsuario(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<boolean> {
    return this.usuarioService.remove(id);
  }
}
