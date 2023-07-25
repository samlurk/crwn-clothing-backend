import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { ConfigAppModule } from './config/config.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProductModule } from './modules/product/product.module';
import { CategoryModule } from './modules/category/category.module';
import { PaymentModule } from './modules/payment/payment.module';
import { CartItemModule } from './modules/cart-item/cart-item.module';
import { OrderModule } from './modules/order/order.module';
import { PaymentDetailModule } from './modules/payment-detail/payment-detail.module';

@Module({
  imports: [
    ConfigAppModule,
    UserModule,
    AuthModule,
    ProductModule,
    CategoryModule,
    PaymentModule,
    CartItemModule,
    OrderModule,
    PaymentDetailModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
