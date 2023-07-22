import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class PaymentService {
  private readonly stripe;

  constructor(private readonly configService: ConfigService) {
    this.stripe = new Stripe(configService.get('strapiApiKey') as string, { apiVersion: '2022-11-15' });
  }

  // calculateOrderAmount()
  async createPayment(cartItems: any[]) {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: 10,
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true
      }
    });
    return paymentIntent;
  }
}
