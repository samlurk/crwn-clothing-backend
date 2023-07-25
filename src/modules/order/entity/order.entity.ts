import { CartItem } from 'src/modules/cart-item/entity/cart-item.entity';
import { PaymentDetail } from 'src/modules/payment-detail/entity/payment-detail.entity';
import { User } from 'src/modules/user/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity('order')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  totalAmount: number;

  @ManyToOne(() => User, (user) => user.orders, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'customer_id' })
  customer: User;

  @ManyToOne(() => CartItem, (cartItem) => cartItem.order, { onDelete: 'NO ACTION', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'cart_item_id' })
  cartItems: CartItem[];

  @OneToOne(() => PaymentDetail, (paymentDetail) => paymentDetail.order, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'payment_detail_id' })
  paymentDetail: PaymentDetail;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;
}
