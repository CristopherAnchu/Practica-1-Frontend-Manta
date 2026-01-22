import { Controller, Post, Get, Body, Headers, UnauthorizedException, UseGuards } from '@nestjs/common';
import { PartnerService } from '../services/partner.service';
import { RegisterPartnerDto, EmitPartnerEventDto } from '../dto/partner.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('partners')
export class PartnerController {
  constructor(private partnerService: PartnerService) {}

  /**
   * POST /partners/register
   * Registra un nuevo partner para recibir webhooks
   */
  @Post('register')
  @UseGuards(JwtAuthGuard)
  async registerPartner(@Body() dto: RegisterPartnerDto) {
    const partner = await this.partnerService.registerPartner(dto);
    
    return {
      message: 'Partner registrado exitosamente',
      partner: {
        id: partner.id,
        name: partner.name,
        apiKey: partner.apiKey,
        hmacSecret: partner.hmacSecret,
        webhookUrl: partner.webhookUrl,
        subscribedEvents: partner.subscribedEvents,
      },
      instructions: {
        step1: 'Guarda tu apiKey y hmacSecret de forma segura',
        step2: 'Incluye el apiKey en el header X-API-Key en tus requests',
        step3: 'Verifica la firma HMAC en webhooks que recibas usando hmacSecret',
        step4: 'Ejemplo de verificación: HMAC-SHA256(payload, hmacSecret)',
      },
    };
  }

  /**
   * GET /partners
   * Lista todos los partners registrados
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllPartners() {
    return this.partnerService.getAllPartners();
  }

  /**
   * POST /partners/webhook
   * Recibe webhooks de partners externos
   */
  @Post('webhook')
  async receivePartnerWebhook(
    @Headers('x-api-key') apiKey: string,
    @Headers('x-unifit-signature') signature: string,
    @Body() payload: any,
  ) {
    if (!apiKey || !signature) {
      throw new UnauthorizedException('Missing API Key or Signature');
    }

    const partner = await this.partnerService.getPartnerByApiKey(apiKey);

    if (!partner) {
      throw new UnauthorizedException('Invalid API Key');
    }

    // Verificar firma HMAC
    const isValid = this.partnerService.verifyHmacSignature(payload, signature, partner.hmacSecret);

    const eventType = payload?.eventType || 'unknown';

    if (!isValid) {
      await this.partnerService.logInboundWebhook(partner.id, eventType, payload, signature, false);
      throw new UnauthorizedException('Invalid HMAC signature');
    }

    await this.partnerService.logInboundWebhook(partner.id, eventType, payload, signature, true);

    // Procesar webhook (aquí implementarías tu lógica de negocio)
    console.log(`✅ Webhook recibido de partner ${partner.name}:`, payload);

    return {
      received: true,
      message: 'Webhook procesado exitosamente',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * POST /partners/emit
   * Envía un evento de prueba hacia un partner para flujo bidireccional
   */
  @Post('emit')
  @UseGuards(JwtAuthGuard)
  async emitToPartner(@Body() dto: EmitPartnerEventDto) {
    await this.partnerService.sendWebhookToPartner(dto.partnerId, {
      eventType: dto.eventType,
      timestamp: new Date().toISOString(),
      data: dto.data || {},
    });

    return {
      sent: true,
      partnerId: dto.partnerId,
      eventType: dto.eventType,
    };
  }
}
