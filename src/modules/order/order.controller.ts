import { Controller, Get, HttpCode, HttpException, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ReqExtUserInterface } from '../auth/interfaces/req-ext-user.interface';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('order')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async getOrders(@Req() req: Request & ReqExtUserInterface) {
    try {
      const ordersResponse = await this.orderService.getOrders(req.user?.id as number);
      return ordersResponse;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      else throw new HttpException('INTERNAL SERVER ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('order/:id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async getOrder(@Req() req: Request & ReqExtUserInterface) {
    try {
      const orderResponse = await this.orderService.getOrder(req.user?.id as number);
      return orderResponse;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      else throw new HttpException('INTERNAL SERVER ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('order/add')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async addOrder(@Req() req: Request & ReqExtUserInterface) {
    try {
      const orderResponse = await this.orderService.addOrder(req.user?.id as number);
      return orderResponse;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      else throw new HttpException('INTERNAL SERVER ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
