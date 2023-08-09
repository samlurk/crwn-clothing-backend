import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderItems } from './entity/order-items.entity';
import { Repository } from 'typeorm';
import { CartItem } from '../cart-item/entity/cart-item.entity';
import { Order } from '../order/entity/order.entity';

@Injectable()
export class OrderItemsService {
  constructor(@InjectRepository(OrderItems) private readonly orderItemsRepository: Repository<OrderItems>) {}

  async getAllOrderItems(userId: number, orderId: number) {
    const orderItemsResponse = await this.orderItemsRepository
      .createQueryBuilder('order_items')
      .innerJoinAndSelect('order_items.order', 'order')
      .innerJoinAndSelect('order.customer', 'customer')
      .innerJoinAndSelect('order_items.product', 'product')
      .select(['order_items', 'product'])
      .where('customer.id = :userId AND order.id = :orderId', { userId, orderId })
      .getMany();
    if (orderItemsResponse.length === 0)
      throw new HttpException('order-items/no-order-items-found', HttpStatus.NOT_FOUND);
    return orderItemsResponse;
  }

  async getOneOrderItems(userId: number, orderId: number, orderItemsId: number) {
    const orderItemsResponse = await this.orderItemsRepository
      .createQueryBuilder('order_items')
      .innerJoinAndSelect('order_items.order', 'order')
      .innerJoinAndSelect('order.customer', 'customer')
      .innerJoinAndSelect('order_items.product', 'product')
      .select(['order_items', 'product'])
      .where('customer.id = :userId AND order.id =:orderId AND order_items.id = :orderItemsId', {
        userId,
        orderId,
        orderItemsId
      })
      .getOne();
    if (orderItemsResponse === null) throw new HttpException('order-items/order-items-not-found', HttpStatus.NOT_FOUND);
    return orderItemsResponse;
  }

  async addManyOrderItems(order: Order, cartItems: CartItem[]) {
    // eslint-disable-next-line prefer-const
    let ordersItemsToInsert: OrderItems[] = [];
    cartItems.forEach((item, i) => {
      ordersItemsToInsert[i] = this.orderItemsRepository.create({
        quantity: item.quantity,
        total: item.total,
        product: item.product,
        order
      });
    }, []);

    await this.orderItemsRepository
      .createQueryBuilder('order_items')
      .insert()
      .into(OrderItems)
      .values(ordersItemsToInsert)
      .execute();

    return ordersItemsToInsert;
  }
}
