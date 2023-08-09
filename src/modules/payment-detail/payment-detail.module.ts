import { Module, forwardRef } from '@nestjs/common';
import { PaymentDetailController } from './payment-detail.controller';
import { PaymentDetailService } from './payment-detail.service';
import { PaymentDetail } from './entity/payment-detail.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ProductModule } from '../product/product.module';
import { OrderModule } from '../order/order.module';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentDetail]), ConfigModule, ProductModule, forwardRef(() => OrderModule)],
  controllers: [PaymentDetailController],
  providers: [PaymentDetailService],
  exports: [PaymentDetailService]
})
export class PaymentDetailModule {}
