import {
  Controller,
  Post,
  Body,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import type { Request } from 'express';
import { BillingService } from './billing.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Billing')
@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Post('checkout')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a Stripe checkout session' })
  async createCheckout(
    @CurrentUser('id') userId: string,
    @Body('tier') tier: 'PRO' | 'TEAM',
  ) {
    return this.billingService.createCheckoutSession(userId, tier);
  }

  @Public()
  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Stripe webhook handler' })
  async webhook(@Req() req: RawBodyRequest<Request>) {
    return this.billingService.handleWebhook(req);
  }
}
