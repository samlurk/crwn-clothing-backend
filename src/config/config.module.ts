import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/modules/user/entity/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Base from './base';
import Database from './db';
import { Product } from 'src/modules/product/entity/product.entity';
import { Category } from 'src/modules/category/entity/category.entity';
import { CartItem } from 'src/modules/cart-item/entity/cart-item.entity';
import { Order } from 'src/modules/order/entity/order.entity';
import { PaymentDetail } from 'src/modules/payment-detail/entity/payment-detail.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [Base, Database] }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('dbHost'),
        port: configService.get<number>('dbPort'),
        username: configService.get<string>('dbUsername'),
        password: configService.get<string>('dbPassword'),
        database: configService.get<string>('dbName'),
        logging: true,
        synchronize: true,
        entities: [User, Product, Category, CartItem, Order, PaymentDetail],
        subscribers: [],
        migrations: []
      })
    })
  ],
  providers: []
})
export class ConfigAppModule {}
