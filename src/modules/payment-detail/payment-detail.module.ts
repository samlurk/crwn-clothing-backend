import { Module } from '@nestjs/common';
import { PaymentDetailController } from './payment-detail.controller';
import { PaymentDetailService } from './payment-detail.service';
import { PaymentDetail } from './entity/payment-detail.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentDetail])],
  controllers: [PaymentDetailController],
  providers: [PaymentDetailService]
})
export class PaymentDetailModule {}
