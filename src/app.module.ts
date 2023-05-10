import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { ConfigAppModule } from './config/config.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProductModule } from './modules/product/product.module';
import { CategoryModule } from './modules/category/category.module';
import { CartItemModule } from './modules/cart-item/cart-item.module';

@Module({
  imports: [ConfigAppModule, UserModule, AuthModule, ProductModule, CategoryModule, CartItemModule],
  controllers: [],
  providers: []
})
export class AppModule {}
