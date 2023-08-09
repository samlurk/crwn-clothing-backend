import { Order } from 'src/modules/order/entity/order.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { PaymentDetailStatus } from '../enums/payment-detail-status.enum';
import { PaymentDetailProvider } from '../enums/payment-detail-provider.enum';

@Entity('payment_detail')
export class PaymentDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  provider: PaymentDetailProvider;

  @Column({
    type: 'enum',
    enum: PaymentDetailStatus,
    default: PaymentDetailStatus.Created
  })
  status: PaymentDetailStatus;

  @Column()
  paymentId: string;

  @OneToOne(() => Order, (order) => order.paymentDetail)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;
}
