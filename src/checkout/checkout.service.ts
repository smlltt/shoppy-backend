import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StringValue } from 'ms';
import { ProductsService } from 'src/products/products.service';
import Stripe from 'stripe';

@Injectable()
export class CheckoutService {
  constructor(
    private readonly stripe: Stripe,
    private readonly productService: ProductsService,
    private readonly configService: ConfigService,
  ) {}
  async createSession(productId: number) {
    const product = await this.productService.getProduct(productId);
    return this.stripe.checkout.sessions.create({
      success_url:
        this.configService.getOrThrow<StringValue>('STRIPE_SUCCESS_URL'),
      cancel_url:
        this.configService.getOrThrow<StringValue>('STRIPE_CANCEL_URL'),
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: product.data.price * 100,
            product_data: {
              name: product.data.name,
              description: product.data.description,
            },
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
    });
  }
}
