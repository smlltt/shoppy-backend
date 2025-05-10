import { Module } from '@nestjs/common';
import { CheckoutController } from './checkout.controller';
import { CheckoutService } from './checkout.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [ConfigModule, ProductsModule],
  controllers: [CheckoutController],
  providers: [
    CheckoutService,
    {
      provide: Stripe,
      useFactory: async (configService: ConfigService) =>
        new Stripe(configService.get('STRIPE_SECRET_KEY')),
      inject: [ConfigService],
    },
  ],
})
export class CheckoutModule {}
