import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Variation } from '@domains/ecommerce/entities';
import { VariationsService } from './variations.service';
import { VariationsController } from './variations.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Variation])],
  controllers: [VariationsController],
  providers: [VariationsService],
  exports: [VariationsService],
})
export class VariationsModule {}
