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
// import { CartItem } from 'src/modules/cart-item/entity/cart-item.entity';

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

  // @OneToOne(() => CartItem, (cartItem) => cartItem.session)
  // cartItem: CartItem;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;
}
