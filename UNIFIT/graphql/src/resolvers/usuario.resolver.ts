import { Resolver, Query, Args } from '@nestjs/graphql';
import { UsuarioService } from '../services/usuario.service';
import { Usuario } from '../entities/usuario.entity';

@Resolver(() => Usuario)
export class UsuarioResolver {
  constructor(private readonly usuarioService: UsuarioService) {}

  // Simplified Queries - Only basic read operations

  @Query(() => [Usuario], { 
    name: 'usuarios',
    description: 'Obtiene todos los usuarios' 
  })
  async getUsuarios(): Promise<Usuario[]> {
    return this.usuarioService.findAll();
  }

  @Query(() => Usuario, { 
    name: 'usuario',
    description: 'Obtiene un usuario por su ID' 
  })
  async getUsuario(
    @Args('id') id: string,
  ): Promise<Usuario> {
    return this.usuarioService.findOne(id);
  }

  // Mutations and complex queries removed - use REST API instead
}
