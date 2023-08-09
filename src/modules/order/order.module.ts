import { Module, forwardRef } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { Order } from './entity/order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItemModule } from '../cart-item/cart-item.module';
import { UserModule } from '../user/user.module';
import { PaymentDetailModule } from '../payment-detail/payment-detail.module';
import { OrderItemsModule } from '../order-items/order-items.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    CartItemModule,
    UserModule,
    forwardRef(() => PaymentDetailModule),
    OrderItemsModule
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService]
})
export class OrderModule {}
