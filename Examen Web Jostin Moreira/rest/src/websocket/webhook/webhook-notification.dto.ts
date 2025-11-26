import { IsString, IsObject, IsDateString, IsNotEmpty } from 'class-validator';

export class WebhookNotificationDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  entity: string;

  @IsString()
  @IsNotEmpty()
  operation: string;

  @IsObject()
  @IsNotEmpty()
  data: any;

  @IsDateString()
  @IsNotEmpty()
  timestamp: string;
}
