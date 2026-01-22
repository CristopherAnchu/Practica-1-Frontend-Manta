import { Controller, Post, Get, Body, Param, Headers, RawBodyRequest, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { PaymentService } from '../services/payment.service';
import { CreatePaymentDto } from '../dto/payment.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('payments')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createPayment(@Body() dto: CreatePaymentDto) {
    return this.paymentService.createPayment(dto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getPayment(@Param('id') id: string) {
    return this.paymentService.getPaymentStatus(id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllPayments() {
    return this.paymentService.getAllPayments();
  }

  @Post(':id/confirm')
  async confirmPayment(@Param('id') id: string, @Body('status') status: string) {
    return this.paymentService.updatePaymentStatus(id, status);
  }

  @Post('webhook')
  async handleWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature?: string,
  ) {
    // Si body-parser raw está activo, req.body es Buffer; si no, usamos rawBody
    const rawBody = (req as any).rawBody || req.body;
    await this.paymentService.processPaymentWebhook(rawBody, signature);
    return { received: true };
  }
}
