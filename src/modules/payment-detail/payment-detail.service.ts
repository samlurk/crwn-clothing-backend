import { HttpException, HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { PaymentDetail } from './entity/payment-detail.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentDetailProvider } from './enums/payment-detail-provider.enum';
import { PaymentDetailStatus } from './enums/payment-detail-status.enum';
import { PaymentIntentEvent } from './enums/payment-intent-event.enum';
import { OrderService } from '../order/order.service';
import { ProductService } from '../product/product.service';
import { Order } from '../order/entity/order.entity';

@Injectable()
export class PaymentDetailService {
  private readonly stripe;

  constructor(
    @InjectRepository(PaymentDetail) private readonly paymentDetailRepository: Repository<PaymentDetail>,
    @Inject(forwardRef(() => OrderService))
    private readonly orderService: OrderService,
    private readonly productService: ProductService,
    configService: ConfigService
  ) {
    this.stripe = new Stripe(configService.get('strapiApiKey') as string, { apiVersion: '2022-11-15' });
  }

  async getAllPayments(userId: number) {
    const paymentDetailResponse = await this.paymentDetailRepository
      .createQueryBuilder('payment_detail')
      .innerJoinAndSelect('payment_detail.order', 'order')
      .innerJoinAndSelect('order.customer', 'customer')
      .select(['payment_detail', 'order.id'])
      .where('customer.id = :userId', { userId })
      .getMany();
    if (paymentDetailResponse.length === 0)
      throw new HttpException('payment-detail/no-payment-detail-found', HttpStatus.NOT_FOUND);
    return paymentDetailResponse;
  }

  async getOnePayment(userId: number, paymentId: string) {
    const paymentDetailResponse = await this.paymentDetailRepository
      .createQueryBuilder('payment_detail')
      .innerJoinAndSelect('payment_detail.order', 'order')
      .innerJoinAndSelect('order.customer', 'customer')
      .select(['payment_detail', 'order.id'])
      .where('payment_detail.paymentId = :paymentId AND customer.id = :userId', { userId, paymentId })
      .getOne();
    if (paymentDetailResponse === null)
      throw new HttpException('payment-detail/payment-detail-not-found', HttpStatus.NOT_FOUND);
    return paymentDetailResponse;
  }

  async createStripePayment(order: Order, paymentMethodId: string) {
    const paymentMethod = await this.stripe.paymentMethods.retrieve(paymentMethodId);

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: order.totalAmount * 100,
      currency: 'usd',
      metadata: {
        ORDER_ID: order.id,
        USER_ID: order.customer.id
      },
      payment_method: paymentMethod.id
    });

    const { id: paymentId } = await this.stripe.paymentIntents.confirm(paymentIntent.id, {
      payment_method: paymentMethod.id
    });

    let paymentDetail = new PaymentDetail();
    paymentDetail.order = order;
    paymentDetail.status = PaymentDetailStatus.Created;
    paymentDetail.provider = PaymentDetailProvider.Stripe;
    paymentDetail.paymentId = paymentId;
    const insertedPaymentDetail = await this.paymentDetailRepository
      .createQueryBuilder('payment_detail')
      .insert()
      .into(PaymentDetail)
      .values(paymentDetail)
      .execute();

    paymentDetail = { ...paymentDetail, ...insertedPaymentDetail.generatedMaps[0] };
    return paymentDetail;
  }

  async updateStripePaymentStatus(event: Stripe.Event) {
    // Fetch the orderId from the webhook metadata
    const { metadata, id: paymentId } = event.data.object as any;
    const { USER_ID, ORDER_ID } = metadata;
    const paymentDetail = await this.getOnePayment(USER_ID, paymentId);
    const order = await this.orderService.getOneOrder(USER_ID, ORDER_ID);

    switch (event.type) {
      // If the event type is a succeeded, update the payment status to succeeded
      case PaymentIntentEvent.Succeeded:
        paymentDetail.status = PaymentDetailStatus.Succeeded;
        order.orderItems.forEach(async (item) => {
          await this.productService.decrementProductInventory(item.product.id, item.quantity);
        });
        break;

      case PaymentIntentEvent.Processing:
        // If the event type is processing, update the payment status to processing
        paymentDetail.status = PaymentDetailStatus.Processing;
        break;

      case PaymentIntentEvent.Failed:
        // If the event type is payment_failed, update the payment status to payment_failed
        paymentDetail.status = PaymentDetailStatus.Failed;
        break;

      default:
        // else, by default the payment status should remain as created
        paymentDetail.status = PaymentDetailStatus.Created;
        break;
    }

    return await this.paymentDetailRepository
      .createQueryBuilder('payment-detail')
      .update(PaymentDetail)
      .set({ status: paymentDetail.status })
      .where('id = :paymentId', { paymentId: paymentDetail.id })
      .execute();
  }
}
