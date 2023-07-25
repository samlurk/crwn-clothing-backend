import { Product } from 'src/modules/product/entity/product.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne
} from 'typeorm';
import { UserRole } from '../enums/user-role.enum';
import { CartItem } from 'src/modules/cart-item/entity/cart-item.entity';
import { Order } from 'src/modules/order/entity/order.entity';
import { PaymentDetail } from 'src/modules/payment-detail/entity/payment-detail.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  firstName: string;

  @Column({ default: null })
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ default: null })
  password: string;

  @Column({ default: null, unique: true })
  phone: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.Customer
  })
  role: UserRole;

  @Column({ default: 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg' })
  avatar: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Product, (product) => product.vendor)
  products: Product[];

  @OneToMany(() => CartItem, (cartItem) => cartItem.session)
  cartItem: CartItem[];

  @OneToMany(() => Order, (order) => order.customer)
  orders: Order[];

  @OneToOne(() => PaymentDetail, (paymentDetail) => paymentDetail.customer)
  paymentDetail: PaymentDetail;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;
}
