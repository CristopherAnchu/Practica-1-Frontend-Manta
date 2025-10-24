import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ExampleService } from './example.services';
import { ExampleResolver } from './example.resolver';

@Module({
  imports: [HttpModule],
  providers: [ExampleService, ExampleResolver],
})
export class ExampleModule {}
