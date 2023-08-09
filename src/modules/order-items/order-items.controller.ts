import {
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Req,
  UseGuards
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OrderItemsService } from './order-items.service';
import { ReqExtUserInterface } from '../auth/interfaces/req-ext-user.interface';

@Controller('order-items')
export class OrderItemsController {
  constructor(private readonly orderItemsService: OrderItemsService) {}

  @Get(':orderId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async getAllOrderItems(
    @Req() req: Request & ReqExtUserInterface,
    @Param('orderId', new ParseIntPipe()) orderId: number
  ) {
    try {
      const orderItemsResponse = await this.orderItemsService.getAllOrderItems(req.user?.id as number, orderId);
      return orderItemsResponse;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      else throw new HttpException('INTERNAL SERVER ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':orderId/:orderItemsId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async getOneOrderItems(
    @Req() req: Request & ReqExtUserInterface,
    @Param('orderId', new ParseIntPipe()) orderId: number,
    @Param('orderItemsId', new ParseIntPipe()) orderItemsId: number
  ) {
    try {
      const orderItemsResponse = await this.orderItemsService.getOneOrderItems(
        req.user?.id as number,
        orderId,
        orderItemsId
      );
      return orderItemsResponse;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      else throw new HttpException('INTERNAL SERVER ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
