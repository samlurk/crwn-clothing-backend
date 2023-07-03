import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany
} from 'typeorm';
import { Category } from '../../category/entity/category.entity';
import { User } from 'src/modules/user/entity/user.entity';
// import { CartItem } from 'src/modules/cart-item/entity/cart-item.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ default: null })
  description: string;

  @Column()
  price: number;

  @Column()
  inventory: number;

  @Column()
  imageUrl: string;

  @ManyToOne(() => User, (user) => user.products, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  @JoinColumn({ name: 'vendor_id' })
  vendor: User;

  @ManyToOne(() => Category, (category) => category.products, { onDelete: 'SET NULL', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  // @OneToMany(() => CartItem, (cartItem) => cartItem.products)
  // cartItem: CartItem;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;
}
