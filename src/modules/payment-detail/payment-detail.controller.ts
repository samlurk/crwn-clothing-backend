import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards
} from '@nestjs/common';
import Stripe from 'stripe';
import { PaymentDetailService } from './payment-detail.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ReqExtUserInterface } from '../auth/interfaces/req-ext-user.interface';

@Controller()
export class PaymentDetailController {
  constructor(private readonly paymentDetailService: PaymentDetailService) {}

  @Get('payment-detail')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async getAllPayments(@Req() req: Request & ReqExtUserInterface) {
    try {
      const paymentDetailResponse = await this.paymentDetailService.getAllPayments(req.user?.id as number);
      return paymentDetailResponse;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      else throw new HttpException('INTERNAL SERVER ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('payment-detail/:id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async getOnePayment(@Req() req: Request & ReqExtUserInterface, @Param('id') paymentId: string) {
    try {
      const paymentDetailResponse = await this.paymentDetailService.getOnePayment(req.user?.id as number, paymentId);
      return paymentDetailResponse;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      else throw new HttpException('INTERNAL SERVER ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('stripe_webhook')
  async webhook(@Body() event: Stripe.Event): Promise<object> {
    await this.paymentDetailService.updateStripePaymentStatus(event);
    return { message: 'success' };
  }
}
