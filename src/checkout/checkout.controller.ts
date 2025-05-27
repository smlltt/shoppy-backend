import { JWTAuthGuard } from '@auth/jwt/jwt.guard';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateCheckoutSessionRequest } from './dto/create-checkout-session.request';
import { CheckoutService } from './checkout.service';
import Stripe from 'stripe';

@Controller('checkout')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}
  @Post('session')
  @UseGuards(JWTAuthGuard)
  async createSession(@Body() body: CreateCheckoutSessionRequest) {
    return this.checkoutService.createSession(body.id);
  }
  // use the code below to listen to Stripe webhooks
  // stripe listen --forward-to localhost:3001/checkout/webhook
  @Post('webhook')
  async handleCheckoutWebhooks(@Body() body: Stripe.Event) {
    return this.checkoutService.handleCheckoutWebhooks(body);
  }
}
