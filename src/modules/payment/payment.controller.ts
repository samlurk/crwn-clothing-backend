import { Body, Controller, HttpException, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentsService: PaymentService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createPayments(@Body() cartItems: any) {
    try {
      const paymentIntent = await this.paymentsService.createPayment(cartItems);
      return paymentIntent;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      else throw new HttpException('INTERNAL SERVER ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
