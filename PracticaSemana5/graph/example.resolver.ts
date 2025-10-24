import { Resolver, Query, Args } from '@nestjs/graphql';
import { ExampleService } from './example.services';

@Resolver('Example')
export class ExampleResolver {
  constructor(private readonly exampleService: ExampleService) {}

  @Query(() => [String]) // Cambia el tipo de retorno según tu esquema
  async findAllExamples() {
    return this.exampleService.findAll();
  }

  @Query(() => String) // Cambia el tipo de retorno según tu esquema
  async findOneExample(@Args('id') id: string) {
    return this.exampleService.findOne(id);
  }
}
