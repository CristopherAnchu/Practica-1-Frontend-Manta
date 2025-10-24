import { Module, HttpModule } from '@nestjs/common';
import { ExampleService } from './example.services';
import { ExampleResolver } from './example.resolver';

@Module({
  imports: [HttpModule],
  providers: [ExampleService, ExampleResolver],
})
export class ExampleModule {}
