import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Put,
  Req,
  UseGuards
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CartItemService } from './cart-item.service';
import { Request } from 'express';
import { ReqExtUserInterface } from '../auth/interfaces/req-ext-user.interface';
import { CreateCartItemsDto } from './dtos/create-cart-items.dto';

@Controller()
export class CartItemController {
  constructor(private readonly cartItemService: CartItemService) {}

  @Get('cart-item')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async getAllCartItems(@Req() req: Request & ReqExtUserInterface) {
    try {
      const cartItemsResponse = await this.cartItemService.getAllCartItems(req.user?.id as number);
      return cartItemsResponse;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      else throw new HttpException('INTERNAL SERVER ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('cart-item/:id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async getOneCartItem(@Req() req: Request & ReqExtUserInterface, @Param('id', new ParseIntPipe()) productId: number) {
    try {
      const cartItemResponse = await this.cartItemService.getOneCartItem(req.user?.id as number, productId);
      return cartItemResponse;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      else throw new HttpException('INTERNAL SERVER ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put('cart-item/bulk/add')
  @UseGuards(JwtAuthGuard)
  @HttpCode(201)
  async addManyItemsToCart(@Req() req: Request & ReqExtUserInterface, @Body() { cartItems }: CreateCartItemsDto) {
    try {
      return await this.cartItemService.addManyItemsToCart(req.user?.id as number, cartItems);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      else throw new HttpException('INTERNAL SERVER ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('cart-item/add/:id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(201)
  async addItemToCart(@Req() req: Request & ReqExtUserInterface, @Param('id', new ParseIntPipe()) productId: number) {
    try {
      return await this.cartItemService.addItemToCart(req.user?.id as number, productId);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      else throw new HttpException('INTERNAL SERVER ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('cart-item/remove/:id')
  @UseGuards(JwtAuthGuard)
  async removeItemToCart(
    @Req() req: Request & ReqExtUserInterface,
    @Param('id', new ParseIntPipe()) productId: number
  ) {
    try {
      return await this.cartItemService.removeItemToCart(req.user?.id as number, productId);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      else throw new HttpException('INTERNAL SERVER ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete('cart-item/clear/:id')
  @UseGuards(JwtAuthGuard)
  async clearItemFromCart(
    @Req() req: Request & ReqExtUserInterface,
    @Param('id', new ParseIntPipe()) productId: number
  ) {
    try {
      return await this.cartItemService.clearItemFromCart(req.user?.id as number, productId);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      else throw new HttpException('INTERNAL SERVER ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
