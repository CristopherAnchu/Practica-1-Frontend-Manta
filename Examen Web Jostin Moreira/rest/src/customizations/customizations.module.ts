import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customization } from '@domains/ecommerce/entities';
import { CustomizationsService } from './customizations.service';
import { CustomizationsController } from './customizations.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Customization])],
  controllers: [CustomizationsController],
  providers: [CustomizationsService],
  exports: [CustomizationsService],
})
export class CustomizationsModule {}
