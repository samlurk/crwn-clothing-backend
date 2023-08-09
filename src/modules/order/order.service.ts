import { HttpException, HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entity/order.entity';
import { Repository } from 'typeorm';
import { CartItemService } from '../cart-item/cart-item.service';
import { PaymentDetailService } from '../payment-detail/payment-detail.service';
import { UserService } from '../user/user.service';
import { OrderItemsService } from '../order-items/order-items.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private readonly orderRepository: Repository<Order>,
    private readonly cartItemService: CartItemService,
    private readonly userService: UserService,
    @Inject(forwardRef(() => PaymentDetailService))
    private readonly paymentDetailService: PaymentDetailService,
    private readonly orderItemsService: OrderItemsService
  ) {}

  async getAllOrders(userId: number) {
    const orderResponse = await this.orderRepository
      .createQueryBuilder('order')
      .innerJoinAndSelect('order.customer', 'customer')
      .innerJoinAndSelect('order.orderItems', 'orderItems')
      .innerJoinAndSelect('orderItems.product', 'product')
      .innerJoinAndSelect('order.paymentDetail', 'paymentDetail')
      .select(['order', 'customer.id', 'paymentDetail.status', 'orderItems', 'product.id'])
      .where('customer.id = :userId', { userId })
      .getMany();
    if (orderResponse.length === 0) throw new HttpException('order/no-order-found', HttpStatus.NOT_FOUND);
    return orderResponse;
  }

  async getOneOrder(userId: number, orderId: number) {
    const orderResponse = await this.orderRepository
      .createQueryBuilder('order')
      .innerJoinAndSelect('order.customer', 'customer')
      .innerJoinAndSelect('order.orderItems', 'orderItems')
      .innerJoinAndSelect('orderItems.product', 'product')
      .innerJoinAndSelect('order.paymentDetail', 'paymentDetail')
      .select(['order', 'customer.id', 'paymentDetail.status', 'orderItems', 'product.id'])
      .where('order.id = :orderId AND customer.id = :userId', { userId, orderId })
      .getOne();
    if (orderResponse === null) throw new HttpException('order/order-not-found', HttpStatus.NOT_FOUND);
    return orderResponse;
  }

  async addOrder(userId: number, paymentId: string) {
    const userResponse = await this.userService.getOneUserById(userId);
    const cartItemResponse = await this.cartItemService.getAllCartItems(userId);
    let order: Order = new Order();
    order.totalAmount = cartItemResponse.reduce((acc, curr) => acc + curr.total, 0);
    order.customer = userResponse;

    const insertedOrder = await this.orderRepository
      .createQueryBuilder('order')
      .insert()
      .into(Order)
      .values(order)
      .execute();

    order = { ...order, ...insertedOrder.generatedMaps[0] };

    await this.orderItemsService.addManyOrderItems(order, cartItemResponse);

    await this.cartItemService.clearAllItemsFromCart(userId);

    await this.paymentDetailService.createStripePayment(order, paymentId);

    return { message: 'Payment Sucessful' };
  }
}
