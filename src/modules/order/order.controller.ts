import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards
} from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ReqExtUserInterface } from '../auth/interfaces/req-ext-user.interface';
import { CreateOrderDto } from './dtos/create-order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async getOrders(@Req() req: Request & ReqExtUserInterface) {
    try {
      const ordersResponse = await this.orderService.getAllOrders(req.user?.id as number);
      return ordersResponse;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      else throw new HttpException('INTERNAL SERVER ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async getOrder(@Req() req: Request & ReqExtUserInterface, @Param('id', new ParseIntPipe()) orderId: number) {
    try {
      const orderResponse = await this.orderService.getOneOrder(req.user?.id as number, orderId);
      return orderResponse;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      else throw new HttpException('INTERNAL SERVER ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async addOrder(@Req() req: Request & ReqExtUserInterface, @Body() newOrder: CreateOrderDto) {
    try {
      const orderResponse = await this.orderService.addOrder(req.user?.id as number, newOrder.paymentId);
      return orderResponse;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      else throw new HttpException('INTERNAL SERVER ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
