import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entity/order.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrderService {
  constructor(@InjectRepository(Order) private readonly orderRepository: Repository<Order>) {}

  async getAllOrders(userId: number) {}

  async getOneOrder(userId: number) {}

  async addOrder(userId: number) {}
}
