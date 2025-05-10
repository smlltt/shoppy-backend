import { JWTAuthGuard } from '@auth/jwt/jwt.guard';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateCheckoutSessionRequest } from './dto/create-checkout-session.request';
import { CheckoutService } from './checkout.service';

@Controller('checkout')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}
  @Post('session')
  @UseGuards(JWTAuthGuard)
  async createSession(@Body() body: CreateCheckoutSessionRequest) {
    return this.checkoutService.createSession(body.id);
  }
}
